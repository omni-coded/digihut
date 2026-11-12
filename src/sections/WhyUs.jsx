import { LuArrowRight } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { WHY_ICONS } from '../content/data';
import SectionHeading from '../components/SectionHeading';
import { LogoMark } from '../components/Logo';

export default function WhyUs() {
  const { t } = useLang();
  const s = t.why;
  const b = s.bridge;

  return (
    <section aria-labelledby="why-title" className="section-y bg-paper">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-14">
        <div>
          <SectionHeading id="why-title" title={s.title} intro={s.intro} />
          <ul className="reveal-stagger mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {s.items.map(([title, desc], i) => {
              const Icon = WHY_ICONS[i];
              return (
                <li key={title}>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-sun">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[1.25rem] font-bold text-forest">{title}</h3>
                  <p className="mt-1.5 text-muted">{desc}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Today → With DigiHut: how familiar habits map to digital tools */}
        <figure className="reveal relative overflow-hidden rounded-[1.5rem] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-7">
          <figcaption className="flex items-center gap-3">
            <LogoMark tone="light" className="h-10 w-auto shrink-0" />
            <span className="font-display text-[1.2rem] font-bold leading-snug text-forest sm:text-[1.3rem]">{b.title}</span>
          </figcaption>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-end gap-x-2 border-b border-line pb-2 text-[0.9rem] font-semibold sm:gap-x-4">
            <span className="text-muted">{b.today}</span>
            <span className="w-6" aria-hidden="true" />
            <span className="text-leaf">{b.tomorrow}</span>
          </div>
          <ul className="divide-y divide-line">
            {b.rows.map(([before, after]) => (
              <li key={before} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2 py-3.5 sm:gap-x-4">
                <span className="text-[1rem] leading-snug text-muted">{before}</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sun text-forest" aria-hidden="true">
                  <LuArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-[1rem] font-semibold leading-snug text-forest">{after}</span>
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}
