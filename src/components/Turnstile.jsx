import { useEffect, useRef, useState } from 'react';

// Cloudflare Turnstile: a free, privacy-friendly spam check. Usually invisible
// to real people; it only shows a checkbox when traffic looks suspicious.
// Only loaded when VITE_TURNSTILE_SITE_KEY is set.

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise = null;

function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
      s.onerror = () => {
        scriptPromise = null;
        reject(new Error('turnstile failed to load'));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

/**
 * Renders the widget and reports a token through onToken ('' when it expires
 * or fails). Change `resetKey` to get a fresh token (tokens are single-use).
 */
export default function Turnstile({ siteKey, lang, onToken, resetKey, failedText }) {
  const box = useRef(null);
  const widgetId = useRef(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then((ts) => {
        if (cancelled || !box.current) return;
        widgetId.current = ts.render(box.current, {
          sitekey: siteKey,
          language: lang === 'hi' ? 'hi' : 'en',
          appearance: 'interaction-only',
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (widgetId.current != null && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* already gone */
        }
      }
      widgetId.current = null;
    };
  }, [siteKey, lang]);

  useEffect(() => {
    if (resetKey && widgetId.current != null && window.turnstile) {
      onTokenRef.current('');
      window.turnstile.reset(widgetId.current);
    }
  }, [resetKey]);

  return (
    <div className="mt-5">
      <div ref={box} />
      {failed && <p className="mt-2 text-[0.92rem] text-danger">{failedText}</p>}
    </div>
  );
}
