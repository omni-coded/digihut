import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from '../content/en';
import hi from '../content/hi';

const DICTS = { en, hi };
const STORAGE_KEY = 'digihut-lang';

const LanguageContext = createContext(null);

function readStoredLang() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'hi') return stored;
  } catch {
    /* storage unavailable — fall through */
  }
  return 'en';
}

/** Replaces {key} tokens in a string. */
export function fill(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => (key in values ? values[key] : `{${key}}`));
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => setLang(lang === 'en' ? 'hi' : 'en'), [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTS[lang].meta.title;
  }, [lang]);

  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang, toggle }), [lang, setLang, toggle]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
