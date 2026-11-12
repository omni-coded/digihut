import { useMemo, useState } from 'react';
import { LuInfo } from 'react-icons/lu';
import { useLang, fill } from '../i18n/LanguageContext';
import { PORTFOLIO, PORTFOLIO_CATEGORIES } from '../content/data';
import SectionHeading from '../components/SectionHeading';
import PortfolioArt from './PortfolioArt';

const INITIAL_COUNT = 6;

export default function Portfolio() {
  const { t } = useLang();
  const s = t.portfolio;
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => (filter === 'all' ? PORTFOLIO : PORTFOLIO.filter((p) => p.cat === filter)), [filter]);
  const visible = filter === 'all' && !showAll ? filtered.slice(0, INITIAL_COUNT) : filtered;
  const filters = ['all', ...PORTFOLIO_CATEGORIES];

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="section-y bg-paper">
      <div className="container-x">
        <SectionHeading id="portfolio-title" title={s.title} intro={s.intro} />

        <p className="mt-6 flex max-w-[44rem] gap-2.5 rounded-xl bg-sun-soft px-4 py-3 text-[0.98rem] text-ink ring-1 ring-sun ring-inset">
          <LuInfo className="mt-1 h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
          {s.note}
        </p>

        <div role="group" aria-label={s.filterLabel} className="rail -mx-[1.125rem] mt-8 flex gap-2 overflow-x-auto px-[1.125rem] pb-1 md:mx-0 md:flex-wrap md:px-0">
          {filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(f);
                  setShowAll(false);
                }}
                className={`min-h-11 shrink-0 rounded-full border px-4 text-[1rem] font-semibold transition-colors ${
                  active ? 'border-forest bg-forest text-white' : 'border-line bg-white text-forest hover:border-forest'
                }`}
              >
                {f === 'all' ? s.all : s.categories[f]}
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          {fill(s.showing, { n: visible.length })}
        </p>

        <ul className="reveal-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const [name, desc] = s.items[p.id];
            return (
              <li key={p.id} className="lift overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
                <div className="relative">
                  <PortfolioArt art={p.art} tone={p.tone} name={name} d={p.d} image={p.image} />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[0.8rem] font-semibold text-forest shadow-sm ring-1 ring-line">
                    {s.demoBadge}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[0.9rem] font-semibold text-leaf">{s.categories[p.cat]}</p>
                  <h3 className="mt-1 text-[1.25rem] font-bold text-forest">{name}</h3>
                  <p className="mt-1 text-muted">{desc}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {filter === 'all' && filtered.length > INITIAL_COUNT && (
          <div className="mt-8 text-center">
            <button type="button" className="btn btn-outline" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
              {showAll ? s.showLess : fill(s.showMore, { n: filtered.length })}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
