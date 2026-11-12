// Central place for every value that must be configured before launch.
// All values come from environment variables (see .env.example).

const env = import.meta.env || {};

function normaliseWhatsApp(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`; // assume an Indian mobile number
  return digits;
}

export const config = {
  whatsappNumber: normaliseWhatsApp(env.VITE_WHATSAPP_NUMBER || '9755307900'),
  contactEmail: (env.VITE_CONTACT_EMAIL || 'digihutsupport@gmail.com').trim(),
  contactPhone: (env.VITE_CONTACT_PHONE || '').trim(),
  instagramHandle: (env.VITE_INSTAGRAM_HANDLE || 'digihut_cg').replace(/^@/, '').trim(),
  supabaseUrl: (env.VITE_SUPABASE_URL || '').replace(/\/+$/, ''),
  supabaseAnonKey: (env.VITE_SUPABASE_ANON_KEY || '').trim(),
  siteUrl: (env.VITE_SITE_URL || '').trim(),
  turnstileSiteKey: (env.VITE_TURNSTILE_SITE_KEY || '').trim(),
  hideSetupNotice: String(env.VITE_HIDE_SETUP_NOTICE || '').toLowerCase() === 'true',
};

export const hasWhatsApp = config.whatsappNumber.length >= 11;
export const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey);
export const hasTurnstile = Boolean(config.turnstileSiteKey);
/** WhatsApp number formatted for display, e.g. +91 97553 07900 */
export const whatsappDisplay = config.whatsappNumber.length === 12
  ? `+${config.whatsappNumber.slice(0, 2)} ${config.whatsappNumber.slice(2, 7)} ${config.whatsappNumber.slice(7)}`
  : `+${config.whatsappNumber}`;

export const instagramUrl = `https://www.instagram.com/${config.instagramHandle}/`;

/** Items still missing, shown to the site owner in the setup reminder. */
export function missingSetup() {
  const items = [];
  if (!hasWhatsApp) items.push({ key: 'VITE_WHATSAPP_NUMBER', label: 'WhatsApp number' });
  if (!hasSupabase) items.push({ key: 'VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY', label: 'Supabase (stores enquiries)' });
  if (hasSupabase && !hasTurnstile) items.push({ key: 'VITE_TURNSTILE_SITE_KEY', label: 'Spam check (Cloudflare Turnstile)' });
  if (!config.contactEmail) items.push({ key: 'VITE_CONTACT_EMAIL', label: 'Business email' });
  return items;
}
