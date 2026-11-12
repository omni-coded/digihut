import { useEffect } from 'react';

/**
 * Gently reveals elements marked .reveal / .reveal-stagger as they scroll into
 * view. Content stays fully visible when JavaScript, IntersectionObserver or
 * motion is unavailable, because hiding only starts once this hook has run.
 */
export default function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') return undefined;
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll('.reveal, .reveal-stagger'));
    const show = (el) => el.classList.add('is-in');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            observer.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    const vh = window.innerHeight;
    items.forEach((el) => {
      // Anything already on screen (or above it) is shown straight away.
      if (el.getBoundingClientRect().top < vh) show(el);
      else observer.observe(el);
    });
    root.classList.add('js-reveal');
    return () => {
      observer.disconnect();
      root.classList.remove('js-reveal');
    };
  }, []);
}
