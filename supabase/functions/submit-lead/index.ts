// Supabase Edge Function: the ONLY way enquiries reach the database once
// supabase/lockdown.sql has been run.
//
// It (1) checks the Cloudflare Turnstile spam token, (2) limits each visitor to
// a few enquiries per hour, (3) re-validates every field, then (4) saves the lead
// with the service-role key, which never leaves Supabase.
//
// Deploy:
//   supabase functions deploy submit-lead
//   supabase secrets set TURNSTILE_SECRET_KEY=... IP_HASH_SALT=<any long random text> ALLOWED_ORIGINS=https://your-domain.in
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const TURNSTILE_SECRET = Deno.env.get('TURNSTILE_SECRET_KEY') ?? '';
const IP_SALT = Deno.env.get('IP_HASH_SALT') ?? '';
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const MAX_PER_IP_PER_HOUR = 5;

const SERVICES = ['presence', 'branding', 'social', 'marketing', 'management', 'insights', 'unsure'];
const CATEGORIES = ['restaurants', 'clothing', 'general', 'salons', 'coaching', 'clinics', 'electronics', 'jewellery', 'events', 'home', 'other'];

function corsHeaders(origin: string | null) {
  const allow = origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) ? origin : ALLOWED_ORIGINS[0] ?? '';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

function reply(status: number, body: Record<string, unknown>, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function normalisePhone(v: unknown) {
  let d = String(v ?? '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d;
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function rest(path: string, init: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== 'POST') return reply(405, { error: 'method_not_allowed' }, origin);
  if (ALLOWED_ORIGINS.length && (!origin || !ALLOWED_ORIGINS.includes(origin))) {
    return reply(403, { error: 'origin_not_allowed' }, origin);
  }
  if (!TURNSTILE_SECRET || !SERVICE_KEY || !IP_SALT) return reply(500, { error: 'server_not_configured' }, origin);

  let payload: { token?: unknown; lead?: Record<string, unknown> };
  try {
    const raw = await req.text();
    if (raw.length > 8000) return reply(413, { error: 'too_large' }, origin);
    payload = JSON.parse(raw);
  } catch {
    return reply(400, { error: 'bad_json' }, origin);
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';

  // 1. Spam check
  const form = new FormData();
  form.append('secret', TURNSTILE_SECRET);
  form.append('response', String(payload.token ?? ''));
  form.append('remoteip', ip);
  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
    .then((r) => r.json())
    .catch(() => ({ success: false }));
  if (!check.success) return reply(403, { error: 'captcha_failed' }, origin);

  // 2. Per-visitor limit (we store only a salted hash of the IP, never the IP itself)
  const ipHash = await sha256(`${IP_SALT}:${ip}`);
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await rest(`leads?select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}`, {
    method: 'HEAD',
    headers: { Prefer: 'count=exact' },
  });
  const count = Number((recent.headers.get('content-range') ?? '*/0').split('/')[1] || 0);
  if (count >= MAX_PER_IP_PER_HOUR) return reply(429, { error: 'rate_limited' }, origin);

  // 3. Validate and whitelist fields
  const l = payload.lead ?? {};
  const name = str(l.name, 120);
  const phone = normalisePhone(l.phone);
  const type = l.type === 'callback' ? 'callback' : 'enquiry';
  const category = CATEGORIES.includes(String(l.category)) ? String(l.category) : null;
  const services = Array.isArray(l.services) ? [...new Set(l.services.map(String).filter((s) => SERVICES.includes(s)))] : [];
  const audit = Number.isInteger(l.audit_score) && (l.audit_score as number) >= 0 && (l.audit_score as number) <= 100 ? l.audit_score : null;

  if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone)) return reply(400, { error: 'invalid' }, origin);
  if (type === 'enquiry' && !category) return reply(400, { error: 'invalid' }, origin);

  const lead = {
    name,
    phone,
    type,
    category,
    services,
    business_name: str(l.business_name, 160) || null,
    city: str(l.city, 80) || null,
    message: str(l.message, 1200) || null,
    language: l.language === 'hi' ? 'hi' : 'en',
    source: str(l.source, 60).replace(/[^a-z0-9-]/gi, '') || 'contact',
    audit_score: audit,
    ip_hash: ipHash,
  };

  // 4. Save
  const res = await rest('leads', { method: 'POST', body: JSON.stringify(lead), headers: { Prefer: 'return=minimal' } });
  if (res.status === 429) return reply(429, { error: 'rate_limited' }, origin);
  if (!res.ok) return reply(502, { error: 'save_failed' }, origin);
  return reply(201, { ok: true }, origin);
});
