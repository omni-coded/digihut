import { LuPlus } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import SectionHeading from '../components/SectionHeading';
import WhatsAppButton from '../components/WhatsAppButton';

export default function FAQ() {
  const { t } = useLang();
  const s = t.faq;

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-paper">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <SectionHeading id="faq-title" title={s.title} intro={s.intro} />
          <WhatsAppButton message={s.waIntro} className="btn btn-wa mt-7">
            {s.ask}
          </WhatsAppButton>
        </div>

        <div className="reveal divide-y divide-line border-y border-line">
          {s.items.map(([q, a], i) => (
            <details key={q} className="group" open={i === 0}>
              <summary className="flex min-h-16 list-none items-center justify-between gap-4 py-4 text-left text-[1.15rem] font-semibold text-forest marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{q}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-forest ring-1 ring-line transition-transform group-open:rotate-45 group-open:bg-sun group-open:ring-sun">
                  <LuPlus className="h-5 w-5" aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-[40rem] pb-5 pr-12 text-[1.05rem] text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
