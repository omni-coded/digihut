import { useState } from 'react';
import { LuCheck, LuMinus, LuChevronDown } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { TIERS, RECOMMENDED_TIER } from '../content/data';
import { useUI } from '../ui/UIContext';
import { composeMessage } from '../lib/whatsapp';
import SectionHeading from '../components/SectionHeading';
import WhatsAppButton from '../components/WhatsAppButton';

function Cell({ value, yes, no }) {
  if (value === true)
    return (
      <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-forest text-sun">
        <LuCheck className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">{yes}</span>
      </span>
    );
  if (value === false)
    return (
      <span className="inline-grid h-7 w-7 place-items-center text-[#9aa8a0]">
        <LuMinus className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">{no}</span>
      </span>
    );
  return <span className="text-[0.95rem] font-medium text-ink">{value}</span>;
}

export default function Pricing() {
  const { t } = useLang();
  const { prefillContact } = useUI();
  const s = t.pricing;
  const [compare, setCompare] = useState(false);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading id="pricing-title" title={s.title} intro={s.intro} />

        <ul className="reveal-stagger mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((id) => {
            const tier = s.tiers[id];
            const featured = id === RECOMMENDED_TIER;
            const waMessage = composeMessage(s.waIntro, [[s.waPackageLabel, tier.name]]);
            return (
              <li
                key={id}
                className={`relative flex flex-col rounded-[1.5rem] p-6 sm:p-7 ${
                  featured ? 'on-dark bg-forest text-white shadow-[var(--shadow-lift)]' : 'border border-line bg-paper'
                }`}
              >
                {featured && (
                  <span className="absolute -top-3.5 left-6 rounded-full bg-sun px-3 py-1 text-[0.85rem] font-bold text-forest">
                    {s.recommended}
                  </span>
                )}
                <h3 className={`text-[1.75rem] font-extrabold ${featured ? 'text-sun' : 'text-forest'}`}>{tier.name}</h3>
                <p className={`mt-1.5 ${featured ? 'text-on-dark' : 'text-muted'}`}>{tier.desc}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <LuCheck className={`mt-1 h-5 w-5 shrink-0 ${featured ? 'text-sun' : 'text-leaf'}`} aria-hidden="true" />
                      <span className={featured ? 'text-white' : 'text-ink'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col gap-2.5">
                  <button
                    type="button"
                    className={`btn w-full ${featured ? 'btn-sun' : 'btn-forest'}`}
                    onClick={() =>
                      prefillContact({ message: `${s.waPackageLabel}: ${tier.name}`, source: `pricing-${id}` })
                    }
                  >
                    {s.quote}
                  </button>
                  <WhatsAppButton message={waMessage} className={`btn w-full ${featured ? 'btn-ghost-light' : 'btn-outline'}`}>
                    {s.whatsapp}
                  </WhatsAppButton>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-muted">{s.note}</p>

        <div className="mt-8">
          <button
            type="button"
            className="link-arrow text-[1.1rem]"
            aria-expanded={compare}
            aria-controls="compare-table"
            onClick={() => setCompare((v) => !v)}
          >
            {compare ? s.compareHide : s.compareShow}
            <LuChevronDown className={`h-5 w-5 transition-transform ${compare ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>

          <div id="compare-table" hidden={!compare} className="mt-5">
            <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <caption className="sr-only">{s.compareCaption}</caption>
                <thead>
                  <tr className="bg-forest text-white">
                    <th scope="col" className="sticky left-0 bg-forest px-4 py-3.5 text-[0.95rem] font-semibold">
                      {s.featureCol}
                    </th>
                    {TIERS.map((id) => (
                      <th key={id} scope="col" className={`px-4 py-3.5 text-center text-[1.05rem] font-bold ${id === RECOMMENDED_TIER ? 'text-sun' : ''}`}>
                        {s.tiers[id].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.rows.map(([label, ...vals], r) => (
                    <tr key={label} className={r % 2 ? 'bg-paper' : 'bg-white'}>
                      <th scope="row" className={`sticky left-0 px-4 py-3 text-[0.98rem] font-medium text-ink ${r % 2 ? 'bg-paper' : 'bg-white'}`}>
                        {label}
                      </th>
                      {vals.map((v, i) => (
                        <td key={i} className="px-4 py-3 text-center">
                          <Cell value={v} yes={s.yes} no={s.no} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
