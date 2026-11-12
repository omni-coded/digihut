import { LuWifi, LuArrowRight } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { goToSection } from '../lib/scroll';
import HeroArt from './HeroArt';

export default function Hero() {
  const { t, lang } = useLang();
  const h = t.hero;

  return (
    <section id="home" aria-labelledby="hero-title" className="on-dark relative bg-forest text-white">
      <div className="container-x grid items-center gap-10 pb-14 pt-8 sm:pt-12 lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:pb-20 lg:pt-14">
        <div className="max-w-[40rem]">
          <p
            className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-1.5 text-[0.8rem] font-semibold text-sun ${
              lang === 'en' ? 'tracking-[0.08em]' : 'text-[0.95rem]'
            }`}
          >
            <LuWifi className="h-4 w-4" aria-hidden="true" />
            {h.badge}
          </p>

          <h1
            id="hero-title"
            className="h-hero mt-5 font-extrabold text-white"
          >
            {h.titleA} <span className="text-sun">{h.titleB}</span>
          </h1>

          <p className="mt-5 max-w-[36rem] text-[1.125rem] leading-relaxed text-on-dark sm:text-[1.2rem]">{h.desc}</p>

          <p className="mt-5 flex items-center gap-3 font-display text-[1.2rem] font-semibold text-white sm:text-[1.35rem]" style={{ fontStretch: '105%' }}>
            <span className="h-[3px] w-8 rounded-full bg-sun" aria-hidden="true" />
            {h.tagline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="btn btn-sun text-[1.1rem]"
              onClick={(e) => {
                e.preventDefault();
                goToSection('contact', { focusSelector: '#lead-name' });
              }}
            >
              {h.primary}
              <LuArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="#services"
              className="btn btn-ghost-light text-[1.1rem]"
              onClick={(e) => {
                e.preventDefault();
                goToSection('services');
              }}
            >
              {h.secondary}
            </a>
          </div>

          <p className="mt-6 text-[1rem] text-on-dark">
            {h.auditPrompt}{' '}
            <a
              href="#audit"
              onClick={(e) => {
                e.preventDefault();
                goToSection('audit');
              }}
              className="font-semibold text-sun underline decoration-sun/60 decoration-2 underline-offset-4 hover:decoration-sun"
            >
              {h.auditLink}
            </a>
          </p>
        </div>

        <HeroArt />
      </div>
      <div className="awning-edge absolute inset-x-0 top-full z-10" style={{ '--awning-a': 'var(--color-forest)' }} aria-hidden="true" />
    </section>
  );
}
