import { useState } from 'react';
import { FaGoogle, FaPinterestP, FaWhatsapp } from 'react-icons/fa6';
import { LuSearch, LuMapPin, LuExternalLink, LuPencilRuler, LuTrendingUp, LuArrowRight, LuCircleAlert, LuInfo } from 'react-icons/lu';
import { useLang, fill } from '../i18n/LanguageContext';
import { INDUSTRIES, INDUSTRY_SEARCH, IDEA_KINDS, TOOL_LINKS, pinterestUrl, canvaUrl, googleSearchUrl, googleMapsUrl } from '../content/data';
import { useUI } from '../ui/UIContext';
import SectionHeading from '../components/SectionHeading';

const LINK_ICONS = { gbp: FaGoogle, wab: FaWhatsapp, canva: LuPencilRuler, pinterest: FaPinterestP, trends: LuTrendingUp };
const external = { target: '_blank', rel: 'noopener noreferrer' };

export default function Tools() {
  const { t } = useLang();
  const { prefillContact } = useUI();
  const s = t.tools;
  const g = s.google;
  const d = s.ideas;

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [needName, setNeedName] = useState(false);
  const [industry, setIndustry] = useState('');

  const query = [name.trim(), city.trim()].filter(Boolean).join(' ');
  const guard = (e) => {
    if (!name.trim()) {
      e.preventDefault();
      setNeedName(true);
      document.getElementById('tool-shop-name')?.focus();
    }
  };
  const prefix = industry ? `${INDUSTRY_SEARCH[industry]} ` : '';

  return (
    <section id="tools" aria-labelledby="tools-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading id="tools-title" title={s.title} intro={s.intro} />

        <div className="reveal-stagger mt-10 grid gap-5 lg:mt-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* 1. Check your shop on Google */}
          <div className="on-dark flex flex-col rounded-[1.5rem] bg-forest p-5 text-white sm:p-7">
            <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-tile)] bg-sun text-forest">
              <LuSearch className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-[1.45rem] font-bold text-white">{g.title}</h3>
            <p className="mt-2 text-on-dark">{g.desc}</p>

            <div className="mt-5 grid gap-4">
              <div>
                <label htmlFor="tool-shop-name" className="field-label !text-white">
                  {g.name}
                </label>
                <input
                  id="tool-shop-name"
                  className="field"
                  autoComplete="organization"
                  enterKeyHint="search"
                  placeholder={g.namePlaceholder}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNeedName(false);
                  }}
                  aria-invalid={needName}
                  aria-describedby={needName ? 'tool-shop-error' : undefined}
                />
                {needName && (
                  <p id="tool-shop-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.95rem] font-medium text-sun">
                    <LuCircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {g.empty}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="tool-shop-city" className="field-label !text-white">
                  {g.city}
                </label>
                <input
                  id="tool-shop-city"
                  className="field"
                  list="cg-cities"
                  autoComplete="address-level2"
                  placeholder={g.cityPlaceholder}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a href={googleSearchUrl(query)} {...external} onClick={guard} className="btn btn-sun w-full">
                <FaGoogle className="h-4 w-4" aria-hidden="true" />
                {g.search}
                <span className="sr-only">({s.newTab})</span>
              </a>
              <a href={googleMapsUrl(query)} {...external} onClick={guard} className="btn btn-ghost-light w-full">
                <LuMapPin className="h-5 w-5" aria-hidden="true" />
                {g.maps}
                <span className="sr-only">({s.newTab})</span>
              </a>
            </div>

            <p className="mt-auto pt-6 text-on-dark">
              {g.missing}{' '}
              <button
                type="button"
                className="font-semibold text-sun underline decoration-sun/60 decoration-2 underline-offset-4 hover:decoration-sun"
                onClick={() => prefillContact({ services: ['presence'], source: 'tools-google' })}
              >
                {g.fix}
              </button>
            </p>
          </div>

          {/* 2. Ideas (Pinterest) and templates (Canva) */}
          <div className="rounded-[1.5rem] border border-line bg-paper p-5 sm:p-7">
            <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-tile)] bg-sun-soft text-forest ring-1 ring-sun ring-inset">
              <LuPencilRuler className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-[1.45rem] font-bold text-forest">{d.title}</h3>
            <p className="mt-2 text-muted">{d.desc}</p>

            <label htmlFor="tool-industry" className="field-label mt-5">
              {d.industry}
            </label>
            <select id="tool-industry" className="field" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">{d.any}</option>
              {INDUSTRIES.map(({ id }) => (
                <option key={id} value={id}>
                  {t.industries.items[id].name}
                </option>
              ))}
            </select>

            <ul className="mt-4 divide-y divide-line border-y border-line">
              {IDEA_KINDS.map((k) => {
                const label = d.kinds[k.id];
                return (
                  <li key={k.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2.5">
                    <span className="min-w-0 font-semibold text-forest">{label}</span>
                    <span className="flex shrink-0 gap-2">
                      <a
                        href={pinterestUrl(`${prefix}${k.pinterest}`)}
                        {...external}
                        aria-label={fill(d.ideasAria, { thing: label })}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-3.5 text-[0.95rem] font-semibold text-forest ring-1 ring-line hover:ring-forest"
                      >
                        <FaPinterestP className="h-4 w-4 text-[#B7081B]" aria-hidden="true" />
                        {d.ideasOn}
                      </a>
                      <a
                        href={canvaUrl(`${prefix}${k.canva}`)}
                        {...external}
                        aria-label={fill(d.makeAria, { thing: label })}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-forest px-3.5 text-[0.95rem] font-semibold text-white hover:bg-leaf"
                      >
                        <LuPencilRuler className="h-4 w-4 text-sun" aria-hidden="true" />
                        {d.makeOn}
                      </a>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* 3. More tools */}
        <h3 className="mt-12 text-[1.3rem] font-bold text-forest">{s.links.title}</h3>
        <ul className="reveal-stagger mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TOOL_LINKS.map(({ id, url }) => {
            const [title, desc] = s.links.items[id];
            const Icon = LINK_ICONS[id];
            return (
              <li key={id}>
                <a
                  href={url}
                  {...external}
                  className="group flex h-full items-start gap-3 rounded-[var(--radius-card)] border border-line bg-white p-4 transition-colors hover:border-leaf lg:flex-col"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-forest">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-bold text-forest" lang="en">
                      {title}
                      <LuExternalLink className="h-3.5 w-3.5 shrink-0 text-muted group-hover:text-leaf" aria-hidden="true" />
                    </span>
                    <span className="mt-0.5 block text-[0.95rem] leading-snug text-muted">{desc}</span>
                    <span className="sr-only">({s.newTab})</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 flex gap-2 text-[0.92rem] text-muted">
          <LuInfo className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {s.disclaimer}
        </p>

        <div className="reveal mt-8 flex flex-col gap-4 rounded-[var(--radius-card)] bg-sun-soft p-5 ring-1 ring-sun ring-inset sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-[1.15rem] text-forest">
            <strong className="font-bold">{s.ctaTitle}</strong> {s.ctaText}
          </p>
          <button type="button" className="btn btn-forest shrink-0" onClick={() => prefillContact({ source: 'tools-cta' })}>
            {s.cta}
            <LuArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
