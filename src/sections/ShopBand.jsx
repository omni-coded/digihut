import { LuStore, LuArrowRight } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { loadProfile } from '../lib/shop';

/** Invitation to "My Shop": say what you sell, get advice for your field. */
export default function ShopBand() {
  const { t } = useLang();
  const b = t.shop.band;
  const returning = Boolean(loadProfile());
  return (
    <section aria-labelledby="shop-band-title" className="bg-white pb-[4.5rem] lg:pb-[6.5rem]">
      <div className="container-x">
        <div className="reveal on-dark relative overflow-hidden rounded-[1.5rem] bg-forest p-6 text-white sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full border-[2.5rem] border-leaf/40" aria-hidden="true" />
          <div className="relative flex max-w-[40rem] gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-sun text-forest">
              <LuStore className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h2 id="shop-band-title" className="text-[clamp(1.5rem,1.2rem+1.4vw,2.1rem)] font-extrabold text-white">
                {b.title}
              </h2>
              <p className="mt-2 text-[1.1rem] text-on-dark">{b.text}</p>
            </div>
          </div>
          <a href="#/my-shop" className="btn btn-sun relative mt-6 w-full shrink-0 text-[1.1rem] sm:w-auto lg:mt-0">
            {returning ? b.ctaReturning : b.cta}
            <LuArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
