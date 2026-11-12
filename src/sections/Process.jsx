import { useLang } from '../i18n/LanguageContext';
import SectionHeading from '../components/SectionHeading';

export default function Process() {
  const { t } = useLang();
  const s = t.process;

  return (
    <section aria-labelledby="process-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading id="process-title" title={s.title} intro={s.intro} />

        <ol className="reveal-stagger mt-12 grid gap-0 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {s.steps.map(([title, desc], i) => (
            <li key={title} className="relative grid grid-cols-[3.25rem_1fr] gap-4 pb-9 last:pb-0 lg:block lg:pb-0">
              {i < s.steps.length - 1 && (
                <span
                  className="absolute bottom-0 left-[1.55rem] top-[3.25rem] w-[3px] bg-mint lg:bottom-auto lg:left-[3.25rem] lg:right-[-1.5rem] lg:top-[1.55rem] lg:h-[3px] lg:w-auto"
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative z-10 grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full font-display text-[1.2rem] font-extrabold ring-[6px] ring-white ${
                  i === 3 ? 'bg-sun text-forest' : 'bg-forest text-sun'
                }`}
                style={{ fontStretch: '110%' }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-2 lg:pt-6">
                <h3 className="text-[1.3rem] font-bold text-forest">
                  <span className="sr-only">{i + 1}. </span>
                  {title}
                </h3>
                <p className="mt-2 text-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
