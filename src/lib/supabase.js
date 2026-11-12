// Minimal Supabase client using the REST endpoints directly (no SDK needed).
// Requires the table and policies in supabase/schema.sql.
import { config, hasSupabase, hasTurnstile } from '../config';

const TIMEOUT_MS = 15000;

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${config.supabaseUrl}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${token || config.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: null, error: err?.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Saves a lead. Resolves to { ok: true } or { ok: false, reason }.
 * reason: 'not_configured' | 'network' | 'timeout' | 'server' | 'rate_limited' | 'captcha'
 *
 * With a Turnstile site key, the lead goes through the submit-lead Edge Function
 * (spam check + per-visitor limit). Without one, it is inserted directly and the
 * database's own rules and rate limit still apply.
 */
export async function submitLead(lead, turnstileToken = '') {
  if (!hasSupabase) return { ok: false, reason: 'not_configured' };
  const res = hasTurnstile
    ? await request('/functions/v1/submit-lead', { method: 'POST', body: { lead, token: turnstileToken } })
    : await request('/rest/v1/leads', { method: 'POST', body: lead, headers: { Prefer: 'return=minimal' } });
  if (res.ok) return { ok: true };
  if (res.status === 429) return { ok: false, reason: 'rate_limited' };
  if (res.status === 403 && res.data?.error === 'captcha_failed') return { ok: false, reason: 'captcha' };
  return { ok: false, reason: res.error || 'server', status: res.status };
}

/* ---------------- Admin (requires a signed-in user listed in public.admins) --------------- */

function toSession(data, email) {
  return {
    token: data.access_token,
    refresh: data.refresh_token || null,
    userId: data.user?.id || null,
    email: data.user?.email || email,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };
}

export async function signIn(email, password) {
  const res = await request('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  });
  if (res.ok && res.data?.access_token) {
    return { ok: true, session: toSession(res.data, email) };
  }
  return { ok: false, message: res.data?.error_description || res.data?.msg || res.error || 'Sign-in failed' };
}

export async function signOut(token) {
  await request('/auth/v1/logout', { method: 'POST', token });
}

export async function fetchLeads(token) {
  const res = await request('/rest/v1/leads?select=*&order=created_at.desc&limit=500', { token });
  if (res.ok) return { ok: true, leads: Array.isArray(res.data) ? res.data : [] };
  return { ok: false, status: res.status, message: res.data?.message || res.error || 'Could not load enquiries' };
}

export async function updateLeadStatus(token, id, status) {
  const res = await request(`/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    token,
    body: { status },
    headers: { Prefer: 'return=minimal' },
  });
  return { ok: res.ok, status: res.status };
}

/* ---------------- Shop-owner accounts ("My Shop") ---------------- */

/** Creates an account. Resolves to { ok, session } or { ok, needsConfirm } or { ok: false, message }. */
export async function signUp(email, password) {
  const res = await request('/auth/v1/signup', { method: 'POST', body: { email, password } });
  if (res.ok && res.data?.access_token) return { ok: true, session: toSession(res.data, email) };
  if (res.ok) return { ok: true, needsConfirm: true };
  return { ok: false, message: res.data?.msg || res.data?.error_description || res.error || 'Sign-up failed' };
}

/** Swaps a refresh token for a fresh session (sessions last about an hour). */
export async function refreshSession(refreshToken) {
  const res = await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: refreshToken } });
  if (res.ok && res.data?.access_token) return { ok: true, session: toSession(res.data, '') };
  return { ok: false };
}

export async function fetchShopProfile(session) {
  const res = await request(`/rest/v1/shop_profiles?select=*&user_id=eq.${encodeURIComponent(session.userId)}`, { token: session.token });
  if (!res.ok) return { ok: false, status: res.status };
  return { ok: true, profile: Array.isArray(res.data) && res.data[0] ? res.data[0] : null };
}

export async function saveShopProfile(session, row) {
  const res = await request('/rest/v1/shop_profiles?on_conflict=user_id', {
    method: 'POST',
    token: session.token,
    body: { ...row, user_id: session.userId },
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  });
  return { ok: res.ok, status: res.status };
}

export async function deleteShopProfile(session) {
  const res = await request(`/rest/v1/shop_profiles?user_id=eq.${encodeURIComponent(session.userId)}`, { method: 'DELETE', token: session.token });
  return { ok: res.ok };
}
