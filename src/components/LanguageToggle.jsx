import { useLang } from '../i18n/LanguageContext';

/** Two-option switch so it is always clear which language is active. */
export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLang();
  const options = [
    { id: 'en', label: 'EN', aria: 'English' },
    { id: 'hi', label: 'हिं', aria: 'हिंदी' },
  ];
  return (
    <div
      role="group"
      aria-label="Language / भाषा"
      className={`inline-flex h-[40px] shrink-0 items-center rounded-full border border-white/25 p-[2px] ${className}`}
    >
      {options.map((o) => {
        const active = lang === o.id;
        return (
          <button
            key={o.id}
            type="button"
            lang={o.id}
            aria-pressed={active}
            aria-label={o.aria}
            onClick={() => setLang(o.id)}
            className={`h-full min-w-[44px] rounded-full px-[12px] text-[15px] font-semibold transition-colors ${
              active ? 'bg-sun text-forest' : 'text-white/85 hover:text-white'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
