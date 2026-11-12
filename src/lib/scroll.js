const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Scrolls to a section on the home page. If we're on another route (#/privacy),
 * switch to home first, then scroll once the section exists.
 */
export function goToSection(id, { focusSelector } = {}) {
  const onHome = !window.location.hash.startsWith('#/');
  const run = () => {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (window.location.hash !== `#${id}`) {
      try {
        window.history.replaceState(null, '', `#${id}`);
      } catch {
        /* sandboxed frames may block history; scrolling still works */
      }
    }
    if (focusSelector) {
      const target = el.querySelector(focusSelector);
      if (target) window.setTimeout(() => target.focus({ preventScroll: true }), 450);
    }
    return true;
  };

  if (onHome && run()) return;
  window.location.hash = id; // switches the router back to home
  let tries = 0;
  const wait = () => {
    if (run() || tries++ > 20) return;
    window.requestAnimationFrame(wait);
  };
  window.requestAnimationFrame(wait);
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'auto' });
}
