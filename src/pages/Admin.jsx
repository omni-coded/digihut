import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { LuLoaderCircle, LuLogOut, LuRefreshCw, LuDownload, LuPhone, LuSearch, LuCircleAlert } from 'react-icons/lu';
import { hasSupabase } from '../config';
import { signIn, signOut, fetchLeads, updateLeadStatus } from '../lib/supabase';
import { useLang } from '../i18n/LanguageContext';

// The admin area is for the DigiHut team, so it is English-only.

const SESSION_KEY = 'digihut-admin-session';
const STATUSES = ['new', 'contacted', 'converted', 'closed'];

function loadSession() {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    const session = raw ? JSON.parse(raw) : null;
    if (session && session.expiresAt > Date.now()) return session;
  } catch {
    /* ignore */
  }
  return null;
}

function saveSession(session) {
  try {
    if (session) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function toCsv(rows) {
  const cols = ['created_at', 'type', 'status', 'name', 'business_name', 'phone', 'category', 'services', 'city', 'message', 'audit_score', 'language', 'source'];
  const esc = (v) => {
    let s = Array.isArray(v) ? v.join('; ') : v == null ? '' : String(v);
    // Stop spreadsheet apps from treating visitor text as a formula (CSV injection).
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

function Shell({ children }) {
  return (
    <section className="section-y min-h-[70vh] bg-paper" lang="en">
      <div className="container-x">{children}</div>
    </section>
  );
}

export default function Admin() {
  const { t } = useLang();
  const [session, setSession] = useState(loadSession);
  const [form, setForm] = useState({ email: '', password: '' });
  const [auth, setAuth] = useState({ loading: false, error: '' });
  const [leads, setLeads] = useState([]);
  const [state, setState] = useState({ loading: false, error: '' });
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = useCallback(async (token) => {
    setState({ loading: true, error: '' });
    const res = await fetchLeads(token);
    if (res.ok) {
      setLeads(res.leads);
      setState({ loading: false, error: '' });
    } else if (res.status === 401) {
      saveSession(null);
      setSession(null);
      setState({ loading: false, error: '' });
      setAuth({ loading: false, error: 'Your session has expired. Please sign in again.' });
    } else {
      setState({ loading: false, error: res.message });
    }
  }, []);

  useEffect(() => {
    if (session) load(session.token);
  }, [session, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (typeFilter !== 'all' && l.type !== typeFilter) return false;
      if (statusFilter !== 'all' && (l.status || 'new') !== statusFilter) return false;
      if (!q) return true;
      return [l.name, l.business_name, l.phone, l.city, l.category, l.message].some((v) => String(v || '').toLowerCase().includes(q));
    });
  }, [leads, query, typeFilter, statusFilter]);

  if (!hasSupabase) {
    return (
      <Shell>
        <div className="max-w-[44rem] rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8">
          <h1 className="text-[2rem] font-extrabold text-forest">Team login is not connected yet</h1>
          <p className="mt-3 text-ink">
            Enquiries and this admin page use Supabase. To turn them on:
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink">
            <li>Create a free project at supabase.com.</li>
            <li>Run <code className="rounded bg-paper px-1.5">supabase/schema.sql</code> in the Supabase SQL editor.</li>
            <li>
              Add <code className="rounded bg-paper px-1.5">VITE_SUPABASE_URL</code> and <code className="rounded bg-paper px-1.5">VITE_SUPABASE_ANON_KEY</code> to your <code className="rounded bg-paper px-1.5">.env</code> file.
            </li>
            <li>Create a team user in Supabase → Authentication, then add their user id to the <code className="rounded bg-paper px-1.5">admins</code> table.</li>
          </ol>
          <p className="mt-4 text-muted">Full steps are in README.md.</p>
          <a href="#home" className="btn btn-forest mt-6">
            {t.legal.back}
          </a>
        </div>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <form
          className="mx-auto max-w-[26rem] rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.email || !form.password) {
              setAuth({ loading: false, error: 'Enter your email and password.' });
              return;
            }
            setAuth({ loading: true, error: '' });
            const res = await signIn(form.email.trim(), form.password);
            if (res.ok) {
              saveSession(res.session);
              setSession(res.session);
              setForm({ email: '', password: '' });
              setAuth({ loading: false, error: '' });
            } else {
              setAuth({ loading: false, error: res.message });
            }
          }}
        >
          <h1 className="text-[1.8rem] font-extrabold text-forest">DigiHut team login</h1>
          <p className="mt-1 text-muted">View and manage website enquiries.</p>
          {auth.error && (
            <p role="alert" className="mt-4 flex gap-2 rounded-xl bg-danger-soft p-3 text-danger">
              <LuCircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              {auth.error}
            </p>
          )}
          <label htmlFor="admin-email" className="field-label mt-5">
            Email
          </label>
          <input id="admin-email" type="email" autoComplete="username" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label htmlFor="admin-password" className="field-label mt-4">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            className="field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="btn btn-forest mt-6 w-full" disabled={auth.loading}>
            {auth.loading && <LuLoaderCircle className="spin h-5 w-5" aria-hidden="true" />}
            {auth.loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </Shell>
    );
  }

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: leads.filter((l) => (l.status || 'new') === s).length }), {});

  return (
    <Shell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[2rem] font-extrabold text-forest">Enquiries</h1>
          <p className="text-muted">
            Signed in as {session.email}. {leads.length} total, {counts.new || 0} new.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline !min-h-11" onClick={() => load(session.token)} disabled={state.loading}>
            <LuRefreshCw className={`h-4 w-4 ${state.loading ? 'spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-outline !min-h-11"
            disabled={!filtered.length}
            onClick={() => {
              const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `digihut-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
          >
            <LuDownload className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </button>
          <button
            type="button"
            className="btn btn-forest !min-h-11"
            onClick={async () => {
              await signOut(session.token);
              saveSession(null);
              setSession(null);
              setLeads([]);
            }}
          >
            <LuLogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search enquiries</span>
          <LuSearch className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input className="field !pl-11" placeholder="Search name, phone, city…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label>
          <span className="sr-only">Filter by type</span>
          <select className="field" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All types</option>
            <option value="enquiry">Enquiries</option>
            <option value="callback">Callbacks</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select className="field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)} ({counts[s] || 0})
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.error && (
        <p role="alert" className="mt-5 flex gap-2 rounded-xl bg-danger-soft p-3 text-danger">
          <LuCircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      {state.loading && !leads.length ? (
        <p className="mt-10 flex items-center gap-2 text-muted">
          <LuLoaderCircle className="spin h-5 w-5" aria-hidden="true" /> Loading enquiries…
        </p>
      ) : filtered.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-line bg-white p-8 text-center">
          <p className="font-semibold text-forest">{leads.length ? 'No enquiries match these filters.' : 'No enquiries yet.'}</p>
          {!leads.length && (
            <p className="mt-1 text-muted">
              New form submissions will appear here. If you expected some, check that your user id is in the <code>admins</code> table.
            </p>
          )}
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((l) => (
            <li key={l.id} className="rounded-[var(--radius-card)] border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[1.15rem] font-bold text-forest">{l.name}</p>
                  {l.business_name && <p className="text-muted">{l.business_name}</p>}
                </div>
                <span className={`chip shrink-0 ${l.type === 'callback' ? '!bg-sun-soft' : ''}`}>{l.type === 'callback' ? 'Callback' : 'Enquiry'}</span>
              </div>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.95rem]">
                <dt className="text-muted">Received</dt>
                <dd>{new Date(l.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</dd>
                {l.category && (
                  <>
                    <dt className="text-muted">Category</dt>
                    <dd>{l.category}</dd>
                  </>
                )}
                {l.services?.length > 0 && (
                  <>
                    <dt className="text-muted">Services</dt>
                    <dd>{l.services.join(', ')}</dd>
                  </>
                )}
                {l.city && (
                  <>
                    <dt className="text-muted">City</dt>
                    <dd>{l.city}</dd>
                  </>
                )}
                {l.audit_score != null && (
                  <>
                    <dt className="text-muted">Audit score</dt>
                    <dd>{l.audit_score}/100</dd>
                  </>
                )}
                <dt className="text-muted">Source</dt>
                <dd>
                  {l.source || 'contact'} · {l.language === 'hi' ? 'Hindi' : 'English'}
                </dd>
              </dl>
              {l.message && <p className="mt-3 whitespace-pre-wrap rounded-xl bg-paper p-3 text-[0.95rem]">{l.message}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={`tel:+91${l.phone}`} className="btn btn-outline !min-h-10 !px-4 text-[0.95rem]">
                  <LuPhone className="h-4 w-4" aria-hidden="true" />
                  {l.phone}
                </a>
                <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noopener noreferrer" className="btn btn-wa !min-h-10 !px-4 text-[0.95rem]">
                  <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
                <label className="ml-auto">
                  <span className="sr-only">Status for {l.name}</span>
                  <select
                    className="field !min-h-10 !py-1.5 text-[0.95rem]"
                    value={l.status || 'new'}
                    onChange={async (e) => {
                      const next = e.target.value;
                      const prev = l.status;
                      setLeads((all) => all.map((x) => (x.id === l.id ? { ...x, status: next } : x)));
                      const res = await updateLeadStatus(session.token, l.id, next);
                      if (!res.ok) {
                        setLeads((all) => all.map((x) => (x.id === l.id ? { ...x, status: prev } : x)));
                        setState((s) => ({ ...s, error: 'Could not update the status. Please try again.' }));
                      }
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
