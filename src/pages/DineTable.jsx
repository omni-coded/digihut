import { useEffect, useRef, useState } from 'react';
import {
  LuArrowLeft,
  LuArrowRight,
  LuX,
  LuSmartphone,
  LuLayoutGrid,
  LuUtensils,
  LuChartNoAxesCombined,
  LuLock,
  LuCircleCheck,
  LuReceipt,
  LuInfo,
} from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { goToSection } from '../lib/scroll';
import { DINETABLE, DT_IMG, DT_SIZE } from '../content/dinetable';
import WhatsAppButton from '../components/WhatsAppButton';
import useReveal from '../hooks/useReveal';

const CHAPTERS = [
  { id: 'guest', icon: LuSmartphone, phone: true },
  { id: 'staff', icon: LuLayoutGrid },
  { id: 'kitchen', icon: LuUtensils },
  { id: 'owner', icon: LuChartNoAxesCombined },
];
const TRUST_ICONS = [LuCircleCheck, LuLock, LuReceipt, LuInfo];
const PREFIX = { guest: '', staff: 'S', kitchen: 'K', owner: 'O' };

const scrollToId = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Steps({ how, list, tone = 'light' }) {
  const muted = tone === 'dark' ? 'text-on-dark' : 'text-muted';
  return (
    <>
      <p className={`mt-4 text-[0.8rem] font-bold uppercase tracking-[0.12em] ${muted}`}>{how}</p>
      <ul className="mt-2 grid gap-1.5">
        {list.map((item) => (
          <li key={item} className="flex gap-2.5 text-[1rem] text-ink">
            <LuCircleCheck className="mt-[0.2rem] h-[1.1rem] w-[1.1rem] shrink-0 text-leaf" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

function Shot({ name, alt, onOpen, className = '' }) {
  return (
    <button type="button" onClick={() => onOpen(name, alt)} className={`group block w-full cursor-zoom-in ${className}`} aria-label={alt}>
      <img
        src={DT_IMG(name)}
        alt={alt}
        width={DT_SIZE[name]?.[0]}
        height={DT_SIZE[name]?.[1]}
        loading="lazy"
        decoding="async"
        className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.01]"
      />
    </button>
  );
}

export default function DineTable() {
  const { lang } = useLang();
  const d = DINETABLE[lang];
  const p = d.page;
  useReveal();

  const [zoom, setZoom] = useState(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoom && !dialog.open) dialog.showModal?.();
    if (!zoom && dialog.open) dialog.close();
  }, [zoom]);
  const open = (name, alt) => setZoom({ name, alt });

  return (
    <article aria-labelledby="dt-title" className="bg-paper">
      {/* Hero */}
      <header className="on-dark relative overflow-hidden bg-forest text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-sun/10" />
        <div className="container-x relative pb-16 pt-10 lg:pb-24 lg:pt-14">
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              goToSection('services');
            }}
            className="inline-flex items-center gap-2 font-semibold text-sun underline decoration-2 underline-offset-4"
          >
            <LuArrowLeft className="h-4 w-4" aria-hidden="true" />
            {p.back}
          </a>
          <div className="mx-auto mt-8 max-w-[52rem] text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1 text-[0.9rem] font-bold text-forest">
              <LuUtensils className="h-4 w-4" aria-hidden="true" />
              {p.badge}
            </span>
            <h1 id="dt-title" className="h-hero mt-5 font-extrabold text-white">
              {p.title}
            </h1>
            <p className="mx-auto mt-5 max-w-[40rem] text-[1.15rem] leading-relaxed text-on-dark">{p.intro}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#dt-guest" onClick={scrollToId('dt-guest')} className="btn btn-sun">
                {d.card.tour}
                <LuArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <WhatsAppButton message={p.wa} className="btn btn-ghost-light">
                {d.card.ask}
              </WhatsAppButton>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-[62rem]">
            <Shot name="g00-tablet" alt={d.card.imgAlt} onOpen={open} className="overflow-hidden rounded-[1.5rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.75)]" />
          </div>

          <ol className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {p.flow.map(([title, desc], i) => (
              <li key={title} className="rounded-2xl bg-white/[0.06] p-4 text-center ring-1 ring-white/10 ring-inset">
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-sun text-[0.9rem] font-extrabold text-forest">{i + 1}</span>
                <span className="mt-2 block font-bold text-white">{title}</span>
                <span className="mt-1 block text-[0.9rem] leading-snug text-on-dark">{desc}</span>
              </li>
            ))}
          </ol>
        </div>
      </header>

      {/* Jump links */}
      <nav aria-label={p.jump} className="sticky top-[64px] z-30 lg:top-[76px] border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-x rail flex gap-2 overflow-x-auto py-3">
          {CHAPTERS.map(({ id, icon: Icon }) => (
            <a key={id} href={`#dt-${id}`} onClick={scrollToId(`dt-${id}`)} className="chip shrink-0 !px-3.5 !py-1.5 font-semibold hover:bg-sun-soft">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {p.chapters[id][0]}
            </a>
          ))}
          <a href="#dt-trust" onClick={scrollToId('dt-trust')} className="chip shrink-0 !px-3.5 !py-1.5 font-semibold hover:bg-sun-soft">
            <LuLock className="h-4 w-4" aria-hidden="true" />
            {p.chapters.trust[0]}
          </a>
        </div>
      </nav>

      {/* Chapters */}
      {CHAPTERS.map(({ id, phone }, ci) => {
        const [title, intro] = p.chapters[id];
        const list = d.steps[id];
        return (
          <section key={id} id={`dt-${id}`} aria-labelledby={`dt-${id}-title`} className={`section-y scroll-mt-36 ${ci % 2 ? 'bg-white' : 'bg-paper'}`}>
            <div className="container-x">
              <div className="reveal max-w-[44rem]">
                <p className="text-[0.85rem] font-bold uppercase tracking-[0.14em] text-leaf">
                  {String(ci + 1).padStart(2, '0')}
                </p>
                <h2 id={`dt-${id}-title`} className="h-section mt-1">
                  {title}
                </h2>
                <p className="mt-4 text-[1.125rem] leading-relaxed text-muted">{intro}</p>
                <p className="mt-2 text-[0.95rem] text-muted">{p.zoom}</p>
              </div>

              {phone ? (
                <>
                  <ul className="mt-10 grid gap-5 lg:grid-cols-2">
                    {list.map(([img, stepTitle, what, how], i) => (
                      <li key={img} className="reveal flex flex-col gap-5 rounded-[var(--radius-card)] border border-line bg-white p-5 sm:flex-row sm:items-center sm:p-6">
                        <Shot name={img} alt={stepTitle} onOpen={open} className="mx-auto max-w-[15rem] shrink-0 overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)] sm:mx-0 sm:w-[11.5rem]" />
                        <div>
                          <span className="chip !bg-sun-soft font-bold">{String(i + 1).padStart(2, '0')}</span>
                          <h3 className="mt-2 text-[1.3rem] font-bold text-forest">{stepTitle}</h3>
                          <p className="mt-1.5 text-[1.03rem] text-muted">{what}</p>
                          <Steps how={p.how} list={how} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="reveal mt-8 grid items-center gap-6 rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-7 lg:grid-cols-[1.6fr_1fr]">
                    <Shot name="g00-tablet" alt={p.tablet[0]} onOpen={open} className="overflow-hidden rounded-[1.25rem] shadow-[var(--shadow-lift)]" />
                    <div>
                      <span className="chip !bg-sun-soft font-bold">+</span>
                      <h3 className="mt-2 text-[1.4rem] font-bold text-forest">{p.tablet[0]}</h3>
                      <p className="mt-1.5 text-[1.03rem] text-muted">{p.tablet[1]}</p>
                      <Steps how={p.how} list={p.tablet[2]} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-10 grid gap-12 lg:gap-16">
                  {list.map(([img, stepTitle, what, how], i) => (
                    <div key={img} className="reveal grid items-center gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
                      <Shot
                        name={img}
                        alt={stepTitle}
                        onOpen={open}
                        className={`overflow-hidden rounded-[1.1rem] border border-line shadow-[var(--shadow-lift)] ${i % 2 ? 'lg:order-2' : ''}`}
                      />
                      <div>
                        <span className="chip !bg-sun-soft font-bold">{PREFIX[id] + (i + 1)}</span>
                        <h3 className="mt-2 text-[1.5rem] font-bold text-forest">{stepTitle}</h3>
                        <p className="mt-1.5 text-[1.06rem] text-muted">{what}</p>
                        <Steps how={p.how} list={how} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Trust */}
      <section id="dt-trust" aria-labelledby="dt-trust-title" className="section-y scroll-mt-36 bg-mint">
        <div className="container-x">
          <div className="reveal max-w-[44rem]">
            <p className="text-[0.85rem] font-bold uppercase tracking-[0.14em] text-leaf">05</p>
            <h2 id="dt-trust-title" className="h-section mt-1">
              {p.chapters.trust[0]}
            </h2>
            <p className="mt-4 text-[1.125rem] leading-relaxed text-muted">{p.chapters.trust[1]}</p>
          </div>
          <ul className="reveal-stagger mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {p.trust.map(([title, desc], i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <li key={title} className="rounded-[var(--radius-card)] border border-line bg-white p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-tile)] bg-sun-soft text-forest ring-1 ring-sun/60 ring-inset">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[1.2rem] font-bold text-forest">{title}</h3>
                  <p className="mt-1.5 text-muted">{desc}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Call to action */}
      <section aria-labelledby="dt-cta-title" className="section-y bg-paper">
        <div className="container-x">
          <div className="reveal on-dark relative overflow-hidden rounded-[1.75rem] bg-forest px-6 py-12 text-center text-white sm:px-10 lg:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sun/15" />
            <h2 id="dt-cta-title" className="relative text-[clamp(1.7rem,1.2rem+2vw,2.6rem)] font-extrabold text-white">
              {p.ctaTitle}
            </h2>
            <p className="relative mx-auto mt-3 max-w-[38rem] text-[1.1rem] text-on-dark">{p.ctaText}</p>
            <div className="relative mt-8 flex justify-center">
              <WhatsAppButton message={p.wa} className="btn btn-sun">
                {p.ctaBtn}
              </WhatsAppButton>
            </div>
            <p className="relative mt-6 text-[0.9rem] text-on-dark">{p.demoNote}</p>
          </div>
        </div>
      </section>

      {/* Screenshot viewer */}
      <dialog
        ref={dialogRef}
        onClose={() => setZoom(null)}
        onClick={(e) => e.target === e.currentTarget && setZoom(null)}
        aria-label={zoom?.alt || ''}
        className="m-auto max-h-[94vh] w-[min(96vw,80rem)] bg-transparent p-0 backdrop:bg-forest-deep/90"
      >
        {zoom && (
          <div className="relative flex flex-col items-center">
            <button
              type="button"
              onClick={() => setZoom(null)}
              className="btn btn-sun mb-3 self-end !min-h-10 !px-4"
              aria-label={p.close}
            >
              <LuX className="h-5 w-5" aria-hidden="true" />
              {p.close}
            </button>
            <img src={DT_IMG(zoom.name)} alt={zoom.alt} className="max-h-[82vh] w-auto max-w-full rounded-2xl" />
          </div>
        )}
      </dialog>
    </article>
  );
}
