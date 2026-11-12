import { useLang } from '../i18n/LanguageContext';
import useTextSize from '../hooks/useTextSize';

const SIZES = ['text-[0.95rem]', 'text-[1.15rem]', 'text-[1.35rem]'];

/** Three-step text size switch. tone="dark" for green surfaces. */
export default function TextSizeControl({ tone = 'dark', className = '' }) {
  const { t } = useLang();
  const [level, setLevel] = useTextSize();
  const dark = tone === 'dark';
  return (
    <div role="group" aria-label={t.nav.textSize} className={`inline-flex items-center gap-1 rounded-full p-1 ${dark ? 'border border-white/25' : 'border border-line bg-white'} ${className}`}>
      {t.nav.textSizes.map((label, i) => {
        const active = level === i;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => setLevel(i)}
            className={`grid h-10 w-11 place-items-center rounded-full font-bold leading-none transition-colors ${SIZES[i]} ${
              active ? 'bg-sun text-forest' : dark ? 'text-white/85 hover:text-white' : 'text-forest hover:bg-mint'
            }`}
          >
            <span aria-hidden="true" lang="en">A</span>
          </button>
        );
      })}
    </div>
  );
}
