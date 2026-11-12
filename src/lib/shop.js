// "My Shop" profile: kept on the visitor's device, and optionally in their account.
const PROFILE_KEY = 'digihut-shop';
const SESSION_KEY = 'digihut-shop-session';

export const EMPTY_PROFILE = { type: '', sells: '', city: '', age: '', goals: [], done: [] };
export const GOALS = ['walkins', 'orders', 'regulars', 'professional', 'time'];
export const AGES = ['new', 'mid', 'old'];

// Which services help with which goal (order matters: most relevant first).
export const GOAL_SERVICES = {
  walkins: ['presence', 'marketing'],
  orders: ['presence', 'social'],
  regulars: ['management', 'marketing'],
  professional: ['branding', 'presence'],
  time: ['management'],
};

function read(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function write(key, value) {
  try {
    if (value == null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the page still works for this visit */
  }
}

export function loadProfile() {
  const p = read(PROFILE_KEY);
  if (!p || typeof p !== 'object' || !p.type) return null;
  return {
    ...EMPTY_PROFILE,
    ...p,
    goals: Array.isArray(p.goals) ? p.goals.filter((g) => GOALS.includes(g)) : [],
    done: Array.isArray(p.done) ? p.done.map(String).slice(0, 20) : [],
  };
}
export const saveProfile = (profile) => write(PROFILE_KEY, profile);
export const loadShopSession = () => read(SESSION_KEY);
export const saveShopSession = (session) => write(SESSION_KEY, session);

/** Database row <-> profile */
export const toRow = (p, lang) => ({
  business_type: p.type,
  sells: p.sells || null,
  city: p.city || null,
  shop_age: p.age || null,
  goals: p.goals,
  done: p.done,
  language: lang,
});
export const fromRow = (r) => ({
  type: r.business_type || '',
  sells: r.sells || '',
  city: r.city || '',
  age: r.shop_age || '',
  goals: Array.isArray(r.goals) ? r.goals : [],
  done: Array.isArray(r.done) ? r.done : [],
});

/** Services to suggest: from goals first, then the industry's usual ones. */
export function suggestedServices(profile, industryServices = []) {
  const fromGoals = profile.goals.flatMap((g) => GOAL_SERVICES[g] || []);
  return [...new Set([...fromGoals, ...industryServices])].slice(0, 4);
}
