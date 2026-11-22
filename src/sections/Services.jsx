import { LuArrowRight } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { SERVICES } from '../content/data';
import { useUI } from '../ui/UIContext';
import SectionHeading from '../components/SectionHeading';
import DineTableCard from './DineTableCard';

export default function Services() {
  const { t } = useLang();
  const { openService } = useUI();
  const s = t.services;

  return (
    <section id="services" aria-labelledby="services-title" className="section-y bg-paper">
      <div className="container-x">
        <SectionHeading id="services-title" title={s.title} intro={s.intro} />

        <ul className="reveal-stagger mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-5">
          {SERVICES.map(({ id, icon: Icon }) => {
            const item = s.items[id];
            return (
              <li
                key={id}
                className="lift group relative flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-colors hover:border-leaf/50 lg:p-7"
              >
                <span className="grid h-14 w-14 place-items-center rounded-[var(--radius-tile)] bg-sun-soft text-forest ring-1 ring-sun/60 ring-inset">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[1.4rem] font-bold text-forest">{item.title}</h3>
                <p className="mt-2 flex-1 text-[1.0625rem] text-muted">{item.desc}</p>
                <button
                  type="button"
                  onClick={() => openService(id)}
                  className="link-arrow mt-5 self-start after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
                  aria-label={`${s.learnMore}: ${item.title}`}
                >
                  {s.learnMore}
                  <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        <DineTableCard />
      </div>
    </section>
  );
}
