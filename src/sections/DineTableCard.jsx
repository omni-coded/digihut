import { LuArrowRight, LuSmartphone, LuLayoutGrid, LuUtensils, LuChartNoAxesCombined } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { DINETABLE, DT_IMG } from '../content/dinetable';
import WhatsAppButton from '../components/WhatsAppButton';

const PART_ICONS = [LuSmartphone, LuLayoutGrid, LuUtensils, LuChartNoAxesCombined];

/** Featured "For restaurants" card shown at the end of the Services section. */
export default function DineTableCard() {
  const { lang } = useLang();
  const c = DINETABLE[lang].card;
  const wa = DINETABLE[lang].page.wa;

  return (
    <article
      aria-labelledby="dinetable-card-title"
      className="reveal on-dark relative mt-8 overflow-hidden rounded-[1.75rem] bg-forest text-white lg:mt-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sun/10"
      />
      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10 lg:p-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sun px-3 py-1 text-[0.85rem] font-bold text-forest">
            <LuUtensils className="h-4 w-4" aria-hidden="true" />
            {c.badge}
          </span>
          <h3 id="dinetable-card-title" className="mt-4 text-[clamp(1.6rem,1.2rem+1.6vw,2.3rem)] font-extrabold leading-tight text-white">
            {c.title}
          </h3>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-on-dark">{c.desc}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {c.parts.map(([title, desc], i) => {
              const Icon = PART_ICONS[i];
              return (
                <li key={title} className="flex gap-3 rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10 ring-inset">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sun text-forest">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-bold text-white">{title}</span>
                    <span className="block text-[0.93rem] leading-snug text-on-dark">{desc}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#/dinetable" className="btn btn-sun">
              {c.tour}
              <LuArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <WhatsAppButton message={wa} className="btn btn-ghost-light">
              {c.ask}
            </WhatsAppButton>
          </div>
        </div>

        <a href="#/dinetable" className="relative block" aria-label={c.tour}>
          <img
            src={DT_IMG('g00-tablet')}
            alt={c.imgAlt}
            width="1700"
            height="1007"
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-[1.25rem] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]"
          />
          <img
            src={DT_IMG('g05-cart')}
            alt=""
            width="600"
            height="1216"
            loading="lazy"
            decoding="async"
            className="absolute -bottom-4 right-3 hidden h-auto w-[28%] rounded-[1.4rem] shadow-[0_24px_50px_-14px_rgb(0_0_0/0.7)] sm:block lg:-bottom-6"
          />
        </a>
      </div>
    </article>
  );
}
