import { LuArrowRight, LuMoveRight } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { INDUSTRIES } from '../content/data';
import { useUI } from '../ui/UIContext';
import SectionHeading from '../components/SectionHeading';

export default function Industries() {
  const { t } = useLang();
  const { openIndustry } = useUI();
  const s = t.industries;

  return (
    <section id="industries" aria-labelledby="industries-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading id="industries-title" title={s.title} intro={s.intro} />

        <p className="mt-6 flex items-center gap-2 text-[0.95rem] font-medium text-leaf lg:hidden" aria-hidden="true">
          {s.swipeHint}
          <LuMoveRight className="h-5 w-5" />
        </p>

        <ul className="reveal-stagger rail -mx-[1.125rem] mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[1.125rem] px-[1.125rem] pb-3 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {INDUSTRIES.map(({ id, icon: Icon }) => {
            const item = s.items[id];
            return (
              <li
                key={id}
                className="flex w-[82%] shrink-0 snap-start flex-col rounded-[var(--radius-card)] border border-line bg-paper p-5 sm:w-[46%] lg:w-auto lg:p-6"
              >
                <div className="flex items-center gap-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-forest text-sun">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="text-[1.3rem] font-bold text-forest">{item.name}</h3>
                </div>
                <ul className="mt-4 flex flex-1 flex-wrap content-start gap-2" aria-label={item.name}>
                  {item.tags.map((tag) => (
                    <li key={tag} className="chip bg-white ring-1 ring-line">
                      {tag}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openIndustry(id)}
                  className="btn mt-5 w-full !min-h-11 bg-white text-[1rem] text-forest ring-1 ring-line hover:bg-forest hover:text-white hover:ring-forest"
                  aria-label={`${s.explore}: ${item.name}`}
                >
                  {s.explore}
                  <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
