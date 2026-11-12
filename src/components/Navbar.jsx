import { useEffect, useRef, useState } from 'react';
import { LuMenu, LuX, LuGauge, LuPackage, LuCircleHelp, LuChevronRight, LuStore } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { NAV_SECTIONS, ALL_SECTIONS } from '../content/data';
import { goToSection } from '../lib/scroll';
import useActiveSection from '../hooks/useActiveSection';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import TextSizeControl from './TextSizeControl';
import WhatsAppButton from './WhatsAppButton';

export default function Navbar({ onHome }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ALL_SECTIONS, onHome);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // While the phone menu is open: lock page scroll, close on Esc, keep focus inside.
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = [toggleRef.current, ...panelRef.current.querySelectorAll('a[href], button:not([disabled])')].filter(Boolean);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Close the phone menu if the screen becomes wide enough for the desktop menu.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const go = (id, options) => (e) => {
    e.preventDefault();
    setOpen(false);
    // Let the menu close first so the scroll target is measured correctly.
    window.requestAnimationFrame(() => goToSection(id, options));
  };

  const links = NAV_SECTIONS.map((id) => ({ id, label: t.nav[id] }));
  const quick = [
    { href: '#/my-shop', label: t.shop.navLabel, icon: LuStore },
    { id: 'audit', label: t.nav.check, icon: LuGauge },
    { id: 'pricing', label: t.nav.packages, icon: LuPackage },
    { id: 'faq', label: t.nav.faq, icon: LuCircleHelp },
  ];

  return (
    <header className="on-dark sticky top-0 z-40 bg-forest text-white shadow-[0_1px_0_rgb(255_255_255/0.08)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-sun focus:px-4 focus:py-2 focus:font-semibold focus:text-forest"
      >
        {t.nav.skip}
      </a>
      <div className="container-x flex h-[64px] items-center justify-between gap-[12px] lg:h-[76px]">
        <a href="#home" onClick={go('home')} className="shrink-0 rounded-lg" aria-label="DigiHut — home">
          <Logo tone="dark" markClass="h-[36px] w-auto lg:h-[40px]" wordClass="text-[25.6px]" />
        </a>

        <nav aria-label={t.nav.mainNav} className="hidden lg:block">
          <ul className="flex items-center">
            {links.map((l) => {
              const isActive = onHome && active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`nav-link relative block whitespace-nowrap rounded-full px-[10px] py-[8px] text-[15.5px] font-medium transition-colors xl:px-[14px] xl:text-[16px] ${
                      isActive ? 'is-active text-sun' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-[8px]">
          <a
            href="#/my-shop"
            className="hidden h-[40px] items-center gap-[6px] whitespace-nowrap rounded-full border border-white/25 px-[12px] text-[15px] font-semibold text-white hover:border-white lg:inline-flex"
          >
            <LuStore className="h-[17px] w-[17px] text-sun" aria-hidden="true" />
            <span className="lg:max-xl:inline xl:max-[1439px]:sr-only">{t.shop.navLabel}</span>
          </a>
          <LanguageToggle />
          <a href="#contact" onClick={go('contact', { focusSelector: '#lead-name' })} className="btn btn-sun hidden !min-h-[44px] whitespace-nowrap !px-[20px] !text-[16.5px] xl:inline-flex">
            {t.nav.cta}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="grid h-[44px] w-[44px] place-items-center rounded-full text-white hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <LuX className="h-[28px] w-[28px]" aria-hidden="true" /> : <LuMenu className="h-[28px] w-[28px]" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Phone and tablet menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="menu-panel absolute inset-x-0 top-full h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain border-t border-white/10 bg-forest lg:hidden"
      >
        <div className="container-x pb-10 pt-4">
          <nav aria-label={t.nav.mainNav}>
            <p className="text-[0.9rem] font-semibold text-sun">{t.nav.explore}</p>
            <ul className="mt-1 divide-y divide-white/10">
              {links.map((l, i) => {
                const isActive = onHome && active === l.id;
                return (
                  <li key={l.id} className="menu-item" style={{ '--i': i }}>
                    <a
                      href={`#${l.id}`}
                      onClick={go(l.id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`flex min-h-[3.25rem] items-center justify-between text-[1.2rem] font-medium ${isActive ? 'text-sun' : 'text-white'}`}
                    >
                      {l.label}
                      <LuChevronRight className="h-5 w-5 opacity-50" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p className="mt-6 text-[0.9rem] font-semibold text-sun">{t.nav.quick}</p>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {quick.map(({ id, href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href || `#${id}`}
                  onClick={href ? () => setOpen(false) : go(id)}
                  className="flex h-full min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/[0.07] px-2 py-3 text-center text-[0.95rem] font-medium leading-tight text-white ring-1 ring-white/10 active:bg-white/15"
                >
                  <Icon className="h-6 w-6 text-sun" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-[1rem] font-medium text-on-dark">{t.nav.textSize}</p>
            <TextSizeControl tone="dark" />
          </div>

          <div className="mt-6 grid gap-3">
            <a href="#contact" onClick={go('contact', { focusSelector: '#lead-name' })} className="btn btn-sun w-full">
              {t.nav.cta}
            </a>
            <WhatsAppButton message={t.contact.waIntroEnquiry} className="btn btn-ghost-light w-full" onBeforeOpen={() => setOpen(false)}>
              {t.nav.chat}
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </header>
  );
}
