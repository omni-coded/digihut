import { useLang } from '../i18n/LanguageContext';
import { goToSection } from '../lib/scroll';

export default function NotFound() {
  const { t } = useLang();
  return (
    <section className="section-y bg-paper">
      <div className="container-x max-w-[40rem] text-center">
        <h1 className="text-[2.4rem] font-extrabold text-forest">{t.common.notFoundTitle}</h1>
        <p className="mt-3 text-[1.1rem] text-muted">{t.common.notFoundBody}</p>
        <a
          href="#home"
          className="btn btn-forest mt-8"
          onClick={(e) => {
            e.preventDefault();
            goToSection('home');
          }}
        >
          {t.legal.back}
        </a>
      </div>
    </section>
  );
}
