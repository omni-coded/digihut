import { LuCamera, LuTarget, LuEye } from 'react-icons/lu';
import { useLang, fill } from '../i18n/LanguageContext';
import { FOUNDER_PHOTOS } from '../content/data';
import SectionHeading from '../components/SectionHeading';

export default function About() {
  const { t } = useLang();
  const s = t.about;
  const [first, ...rest] = s.story;

  return (
    <section id="about" aria-labelledby="about-title" className="section-y bg-paper">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <SectionHeading id="about-title" title={s.title} />
            <p className="mt-6 max-w-[38rem] font-display text-[1.35rem] font-semibold leading-snug text-forest sm:text-[1.5rem]">{first}</p>
            {rest.map((p) => (
              <p key={p} className="mt-4 max-w-[38rem] text-[1.1rem] text-muted">
                {p}
              </p>
            ))}
          </div>

          <div className="reveal-stagger grid content-start gap-4">
            <div className="on-dark rounded-[var(--radius-card)] bg-forest p-6 text-white sm:p-7">
              <p className="flex items-center gap-2.5 text-[1rem] font-semibold text-sun">
                <LuTarget className="h-5 w-5" aria-hidden="true" />
                {s.mission[0]}
              </p>
              <p className="mt-3 text-[1.2rem] leading-snug">{s.mission[1]}</p>
            </div>
            <div className="rounded-[var(--radius-card)] bg-sun-soft p-6 ring-1 ring-sun ring-inset sm:p-7">
              <p className="flex items-center gap-2.5 text-[1rem] font-semibold text-leaf">
                <LuEye className="h-5 w-5" aria-hidden="true" />
                {s.vision[0]}
              </p>
              <p className="mt-3 text-[1.2rem] leading-snug text-forest">{s.vision[1]}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-10">
          <h3 className="text-[1.6rem] font-bold text-forest">{s.valuesTitle}</h3>
          <ul className="reveal-stagger mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {s.values.map(([title, desc]) => (
              <li key={title} className="border-l-[3px] border-sun pl-4">
                <p className="text-[1.15rem] font-bold text-forest">{title}</p>
                <p className="mt-1 text-muted">{desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16">
          <h3 className="text-[1.6rem] font-bold text-forest">{s.foundersTitle}</h3>
          <p className="mt-2 text-muted">{s.foundersIntro}</p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {s.founders.map(([name, role], i) => {
              const photo = FOUNDER_PHOTOS[i];
              return (
                <li key={i} className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-white p-4">
                  {photo ? (
                    <img
                      src={photo}
                      alt={fill(s.photoAlt, { name })}
                      width="80"
                      height="80"
                      loading="lazy"
                      decoding="async"
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-2 border-dashed border-[#b9c7bd] bg-paper text-center text-[0.72rem] font-medium leading-tight text-muted">
                      <span className="grid place-items-center gap-1 px-1">
                        <LuCamera className="h-5 w-5 text-leaf" aria-hidden="true" />
                        {s.photoPlaceholder}
                      </span>
                    </span>
                  )}
                  <div>
                    <p className="text-[1.15rem] font-bold text-forest">{name}</p>
                    <p className="text-muted">{role}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
