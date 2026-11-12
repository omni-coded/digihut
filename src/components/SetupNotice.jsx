import { useState } from 'react';
import { LuSettings, LuX } from 'react-icons/lu';
import { config, missingSetup } from '../config';
import { useLang } from '../i18n/LanguageContext';

/**
 * Small reminder for the site owner listing settings that are still missing.
 * Disappears once everything is configured, or with VITE_HIDE_SETUP_NOTICE=true.
 */
export default function SetupNotice() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const missing = missingSetup();
  if (config.hideSetupNotice || hidden || missing.length === 0) return null;

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-3 z-30 max-w-[calc(100vw-1.5rem)] lg:bottom-6 lg:left-6" lang="en">
      {open ? (
        <div className="w-[21rem] max-w-full rounded-2xl bg-white p-4 text-[0.92rem] text-ink shadow-[0_14px_40px_-12px_rgb(13_46_32/0.55)] ring-1 ring-line">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-forest">{t.common.setupTitle}</p>
            <button type="button" onClick={() => setOpen(false)} className="-m-1 grid h-8 w-8 place-items-center rounded-full hover:bg-mint" aria-label="Collapse">
              <LuX className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1 text-muted">{t.common.setupBody}</p>
          <ul className="mt-3 space-y-1.5">
            {missing.map((m) => (
              <li key={m.key}>
                <span className="font-semibold">{m.label}</span>
                <code className="mt-0.5 block break-all rounded bg-paper px-1.5 py-0.5 text-[0.78rem] text-leaf">{m.key}</code>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setHidden(true)} className="mt-3 text-[0.85rem] font-semibold text-leaf underline underline-offset-4">
            {t.common.setupDismiss}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-11 items-center gap-2 rounded-full bg-white px-3.5 text-[0.88rem] font-semibold text-forest shadow-[0_8px_24px_-10px_rgb(13_46_32/0.6)] ring-1 ring-sun"
        >
          <LuSettings className="h-4 w-4 text-leaf" aria-hidden="true" />
          Setup: {missing.length}
        </button>
      )}
    </div>
  );
}
