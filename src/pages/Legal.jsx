import { LuArrowLeft } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { goToSection } from '../lib/scroll';

export default function Legal({ kind }) {
  const { t } = useLang();
  const l = t.legal;
  const page = l[kind];

  return (
    <article className="section-y bg-paper" aria-labelledby="legal-title">
      <div className="container-x max-w-[48rem]">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goToSection('home');
          }}
          className="link-arrow"
        >
          <LuArrowLeft className="h-4 w-4" aria-hidden="true" />
          {l.back}
        </a>
        <h1 id="legal-title" className="mt-6 text-[clamp(2rem,1.5rem+2vw,2.75rem)] font-extrabold text-forest">
          {page.title}
        </h1>
        <p className="mt-2 text-muted">{l.updated}</p>
        <p className="mt-4 rounded-xl bg-sun-soft px-4 py-3 text-[0.95rem] ring-1 ring-sun ring-inset">{l.draft}</p>

        <div className="mt-10 space-y-8">
          {page.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-[1.35rem] font-bold text-forest">{heading}</h2>
              <p className="mt-2 text-[1.08rem] leading-relaxed text-ink">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
