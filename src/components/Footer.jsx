import { FaInstagram } from 'react-icons/fa6';
import { useLang } from '../i18n/LanguageContext';
import { SERVICES, INDUSTRIES, NAV_SECTIONS } from '../content/data';
import { useUI } from '../ui/UIContext';
import { goToSection } from '../lib/scroll';
import { config, instagramUrl } from '../config';
import Logo from './Logo';
import WhatsAppButton from './WhatsAppButton';
import TextSizeControl from './TextSizeControl';

function FooterHeading({ children }) {
  return <h2 className="text-[1rem] font-bold text-sun">{children}</h2>;
}

const linkClass = 'inline-flex min-h-10 items-center text-left text-[1rem] text-on-dark hover:text-white hover:underline underline-offset-4';

export default function Footer() {
  const { t } = useLang();
  const { openService, openIndustry } = useUI();
  const fo = t.footer;

  const section = (id) => (e) => {
    e.preventDefault();
    goToSection(id);
  };

  const quick = [
    ...NAV_SECTIONS.map((id) => [id, t.nav[id]]),
    ['pricing', fo.pricing],
    ['audit', fo.audit],
    ['faq', fo.faq],
  ];

  return (
    <footer className="on-dark relative bg-forest text-white">
      <div className="awning-edge absolute inset-x-0 top-0" style={{ '--awning-a': 'var(--color-paper)' }} aria-hidden="true" />
      <div className="container-x pb-10 pt-16 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr_1fr]">
          <div className="max-w-xs">
            <Logo tone="dark" />
            <p className="mt-4 font-display text-[1.2rem] font-semibold text-white">{fo.tagline}</p>
            <p className="mt-2 text-on-dark">{fo.about}</p>
          </div>

          <nav aria-label={fo.quick}>
            <FooterHeading>{fo.quick}</FooterHeading>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
              {quick.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={section(id)} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#/my-shop" className={linkClass}>
                  {t.shop.navLabel}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <FooterHeading>{fo.services}</FooterHeading>
            <ul className="mt-3">
              {SERVICES.map(({ id }) => (
                <li key={id}>
                  <button type="button" onClick={() => openService(id)} className={linkClass}>
                    {t.services.items[id].title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>{fo.industries}</FooterHeading>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
              {INDUSTRIES.map(({ id }) => (
                <li key={id}>
                  <button type="button" onClick={() => openIndustry(id)} className={linkClass}>
                    {t.industries.items[id].name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>{fo.connect}</FooterHeading>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-2`}>
                  <FaInstagram className="h-5 w-5" aria-hidden="true" />@{config.instagramHandle}
                </a>
              </li>
              <li>
                <WhatsAppButton message={t.contact.waIntroEnquiry} className={`${linkClass} gap-2`}>
                  {t.common.whatsapp}
                </WhatsAppButton>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <p className="text-[1rem] font-medium text-on-dark">{t.nav.textSize}</p>
          <TextSizeControl tone="dark" />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 text-[0.95rem] text-on-dark md:flex-row md:items-center md:justify-between">
          <p>{fo.copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            <li>
              <a href="#/privacy" className="inline-flex min-h-10 items-center hover:text-white hover:underline underline-offset-4">
                {fo.privacy}
              </a>
            </li>
            <li>
              <a href="#/terms" className="inline-flex min-h-10 items-center hover:text-white hover:underline underline-offset-4">
                {fo.terms}
              </a>
            </li>
            <li>
              <a href="#/admin" className="inline-flex min-h-10 items-center text-on-dark/70 hover:text-white hover:underline underline-offset-4">
                {fo.team}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
