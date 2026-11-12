import { useCallback, useEffect, useState } from 'react';

const KEY = 'digihut-text-size';
const SCALES = ['100%', '112.5%', '125%'];

function read() {
  try {
    const n = Number(window.localStorage.getItem(KEY));
    if (n === 1 || n === 2) return n;
  } catch {
    /* storage unavailable */
  }
  return 0;
}

export function applyTextSize(level) {
  document.documentElement.style.fontSize = SCALES[level] || SCALES[0];
}

/** Lets visitors enlarge all text. Everything is sized in rem, so the whole page scales. */
export default function useTextSize() {
  const [level, setLevelState] = useState(read);
  useEffect(() => {
    applyTextSize(level);
    const sync = (e) => setLevelState(e.detail);
    window.addEventListener('digihut-text-size', sync);
    return () => window.removeEventListener('digihut-text-size', sync);
  }, [level]);
  const setLevel = useCallback((next) => {
    try {
      window.localStorage.setItem(KEY, String(next));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent('digihut-text-size', { detail: next }));
  }, []);
  return [level, setLevel];
}
