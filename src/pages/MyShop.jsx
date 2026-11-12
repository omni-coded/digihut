import { useCallback, useEffect, useRef, useState } from 'react';
import { FaPinterestP } from 'react-icons/fa6';
import { LuCheck, LuCircleAlert, LuCircleCheck, LuLoaderCircle, LuPencil, LuPencilRuler, LuSend, LuStore, LuTrash2, LuLock, LuArrowLeft } from 'react-icons/lu';
import { useLang, fill } from '../i18n/LanguageContext';
import { useUI } from '../ui/UIContext';
import { INDUSTRIES, SERVICES, IDEA_KINDS, INDUSTRY_SEARCH, pinterestUrl, canvaUrl } from '../content/data';
import { hasSupabase } from '../config';
import { composeMessage } from '../lib/whatsapp';
import { goToSection } from '../lib/scroll';
import { EMPTY_PROFILE, GOALS, AGES, loadProfile, saveProfile, loadShopSession, saveShopSession, toRow, fromRow, suggestedServices } from '../lib/shop';
import { signIn, signUp, signOut, refreshSession, fetchShopProfile, saveShopProfile, deleteShopProfile } from '../lib/supabase';
import WhatsAppButton from '../components/WhatsAppButton';

const external = { target: '_blank', rel: 'noopener noreferrer' };
const chip = (on) =>
  `inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-[1rem] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sun-deep ${
    on ? 'border-forest bg-forest text-white' : 'border-line bg-white text-forest hover:border-leaf'
  }`;

/* ------------------------------ Form ------------------------------ */
function ShopForm({ initial, onSave, onSkip }) {
  const { t } = useLang();
  const f = t.shop.form;
  const [v, setV] = useState(initial || EMPTY_PROFILE);
  const [error, setError] = useState(false);
  const optional = <span className="font-normal text-muted"> ({f.optional})</span>;
  const toggleGoal = (g) => setV((p) => ({ ...p, goals: p.goals.includes(g) ? p.goals.filter((x) => x !== g) : [...p.goals, g] }));

  return (
    <form
      noValidate
      className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (!v.type) {
          setError(true);
          document.getElementById('shop-type')?.focus();
          return;
        }
        // If the business type changed, earlier ticks no longer match the tips.
        const done = initial && initial.type === v.type ? v.done : [];
        onSave({ ...v, sells: v.sells.trim().replace(/[<>]/g, ''), city: v.city.trim().replace(/[<>]/g, ''), done });
      }}
    >
      <h1 className="text-[clamp(1.8rem,1.4rem+1.8vw,2.4rem)] font-extrabold text-forest">{f.title}</h1>
      <p className="mt-2 text-muted">{f.intro}</p>

      <div className="mt-6 grid gap-6">
        <div>
          <label htmlFor="shop-type" className="field-label">
            {f.type}
          </label>
          <select
            id="shop-type"
            className="field"
            value={v.type}
            onChange={(e) => {
              setV({ ...v, type: e.target.value });
              setError(false);
            }}
            aria-invalid={error}
            aria-describedby={error ? 'shop-type-error' : undefined}
            required
          >
            <option value="">{f.typePlaceholder}</option>
            {INDUSTRIES.map(({ id }) => (
              <option key={id} value={id}>
                {t.industries.items[id].name}
              </option>
            ))}
            <option value="other">{t.contact.form.other}</option>
          </select>
          {error && (
            <p id="shop-type-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.95rem] font-medium text-danger">
              <LuCircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
              {f.typeError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="shop-sells" className="field-label">
            {f.sells}
            {optional}
          </label>
          <input id="shop-sells" className="field" maxLength={200} placeholder={f.sellsPlaceholder} value={v.sells} onChange={(e) => setV({ ...v, sells: e.target.value })} aria-describedby="shop-sells-hint" />
          <p id="shop-sells-hint" className="mt-1.5 text-[0.9rem] text-muted">
            {f.sellsHint}
          </p>
        </div>

        <div>
          <label htmlFor="shop-city" className="field-label">
            {f.city}
            {optional}
          </label>
          <input id="shop-city" className="field" maxLength={80} list="shop-cities" autoComplete="address-level2" placeholder={t.contact.form.cityPlaceholder} value={v.city} onChange={(e) => setV({ ...v, city: e.target.value })} />
          <datalist id="shop-cities">
            {t.contact.cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <fieldset>
          <legend className="field-label">
            {f.age}
            {optional}
          </legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {AGES.map((a) => (
              <label key={a} className={chip(v.age === a)}>
                <input type="radio" name="shop-age" className="sr-only" checked={v.age === a} onChange={() => setV({ ...v, age: a })} onClick={() => v.age === a && setV({ ...v, age: '' })} />
                {f.ages[a]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="field-label">
            {f.goals}
            {optional}
          </legend>
          <p className="-mt-1 mb-2.5 text-[0.9rem] text-muted">{f.goalsHint}</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => {
              const on = v.goals.includes(g);
              return (
                <label key={g} className={chip(on)}>
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleGoal(g)} />
                  {on && <LuCircleCheck className="h-4 w-4 text-sun" aria-hidden="true" />}
                  {f.goalOptions[g]}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-forest sm:min-w-[14rem]">
          {initial ? f.update : f.submit}
        </button>
        <button type="button" className="btn btn-outline" onClick={onSkip}>
          {f.skip}
        </button>
      </div>
      <p className="mt-4 flex gap-2 text-[0.92rem] text-muted">
        <LuLock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {f.privacy}
      </p>
    </form>
  );
}

/* ------------------------------ Account ------------------------------ */
function AccountCard({ session, onSession, syncError, synced }) {
  const { t } = useLang();
  const a = t.shop.account;
  const [form, setForm] = useState({ email: '', password: '' });
  const [state, setState] = useState({ busy: '', error: '', notice: '' });

  const run = async (mode) => {
    const email = form.email.trim();
    if (!/^\S+@\S+\.\S+$/.test(email) || form.password.length < 8) {
      setState({ busy: '', error: a.errors.fields, notice: '' });
      return;
    }
    setState({ busy: mode, error: '', notice: '' });
    const res = mode === 'create' ? await signUp(email, form.password) : await signIn(email, form.password);
    if (res.ok && res.session) {
      setForm({ email: '', password: '' });
      setState({ busy: '', error: '', notice: '' });
      onSession(res.session);
    } else if (res.ok && res.needsConfirm) {
      setState({ busy: '', error: '', notice: a.confirm });
    } else {
      setState({ busy: '', error: a.errors.failed, notice: '' });
    }
  };

  return (
    <section aria-labelledby="shop-account-title" className="rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6">
      <h2 id="shop-account-title" className="text-[1.25rem] font-bold text-forest">
        {a.title}
      </h2>
      {session ? (
        <div className="mt-2">
          <p className="text-ink">{fill(a.signedIn, { email: session.email })}</p>
          {syncError ? (
            <p role="alert" className="mt-2 flex gap-2 text-danger">
              <LuCircleAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
              {a.errors.sync}
            </p>
          ) : (
            synced && (
              <p role="status" className="mt-2 flex items-center gap-2 text-leaf">
                <LuCircleCheck className="h-4 w-4" aria-hidden="true" />
                {a.synced}
              </p>
            )
          )}
          <button
            type="button"
            className="btn btn-outline mt-4 !min-h-11"
            onClick={async () => {
              await signOut(session.token);
              onSession(null);
            }}
          >
            {a.signOut}
          </button>
        </div>
      ) : (
        <form
          noValidate
          className="mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            run('signin');
          }}
        >
          <p className="text-muted">{a.text}</p>
          {state.error && (
            <p role="alert" className="mt-3 flex gap-2 rounded-xl bg-danger-soft p-3 text-danger">
              <LuCircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              {state.error}
            </p>
          )}
          {state.notice && (
            <p role="status" className="mt-3 rounded-xl bg-mint p-3 text-forest">
              {state.notice}
            </p>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="shop-email" className="field-label">
                {a.email}
              </label>
              <input id="shop-email" type="email" inputMode="email" autoComplete="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="shop-password" className="field-label">
                {a.password}
              </label>
              <input id="shop-password" type="password" autoComplete="current-password" className="field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-describedby="shop-password-hint" />
              <p id="shop-password-hint" className="mt-1.5 text-[0.9rem] text-muted">
                {a.passwordHint}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="btn btn-forest !min-h-11" disabled={Boolean(state.busy)}>
              {state.busy === 'signin' && <LuLoaderCircle className="spin h-5 w-5" aria-hidden="true" />}
              {state.busy === 'signin' ? a.working : a.signIn}
            </button>
            <button type="button" className="btn btn-outline !min-h-11" disabled={Boolean(state.busy)} onClick={() => run('create')}>
              {state.busy === 'create' && <LuLoaderCircle className="spin h-5 w-5" aria-hidden="true" />}
              {state.busy === 'create' ? a.working : a.create}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/* ------------------------------ Page ------------------------------ */
export default function MyShop() {
  const { t, lang } = useLang();
  const { openService, prefillContact } = useUI();
  const s = t.shop;
  const ad = s.advice;

  const [profile, setProfile] = useState(loadProfile);
  const [editing, setEditing] = useState(false);
  const [session, setSession] = useState(null);
  const [sync, setSync] = useState({ error: false, done: false });
  const [cleared, setCleared] = useState(false);
  const headingRef = useRef(null);
  const langRef = useRef(lang);
  langRef.current = lang;

  const push = useCallback(async (sess, p) => {
    if (!sess || !p) return;
    const res = await saveShopProfile(sess, toRow(p, langRef.current));
    setSync({ error: !res.ok, done: res.ok });
  }, []);

  // After sign-in (or on return visits): local answers win; otherwise load the saved ones.
  const connect = useCallback(
    async (sess) => {
      setSession(sess);
      saveShopSession(sess);
      setSync({ error: false, done: false });
      if (!sess) return;
      const local = loadProfile();
      if (local) {
        push(sess, local);
      } else {
        const res = await fetchShopProfile(sess);
        if (res.ok && res.profile) {
          const p = fromRow(res.profile);
          saveProfile(p);
          setProfile(p);
          setSync({ error: false, done: true });
        }
      }
    },
    [push],
  );

  useEffect(() => {
    if (!hasSupabase) return;
    const stored = loadShopSession();
    if (!stored?.token) return;
    (async () => {
      if (stored.expiresAt - Date.now() > 60000) return connect(stored);
      if (!stored.refresh) return saveShopSession(null);
      const res = await refreshSession(stored.refresh);
      if (res.ok) connect({ ...res.session, email: res.session.email || stored.email });
      else saveShopSession(null);
    })();
  }, [connect]);

  const update = (next) => {
    saveProfile(next);
    setProfile(next);
    setCleared(false);
    push(session, next);
  };

  const showForm = !profile || editing;
  useEffect(() => {
    if (!showForm) headingRef.current?.focus({ preventScroll: true });
  }, [showForm]);

  const back = (
    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault();
        goToSection('home');
      }}
      className="link-arrow"
    >
      <LuArrowLeft className="h-4 w-4" aria-hidden="true" />
      {t.legal.back}
    </a>
  );

  if (showForm) {
    return (
      <section className="section-y bg-paper">
        <div className="container-x max-w-[46rem]">
          {back}
          {cleared && (
            <p role="status" className="mt-5 flex items-center gap-2 rounded-xl bg-mint p-3 text-forest">
              <LuCircleCheck className="h-5 w-5" aria-hidden="true" />
              {ad.cleared}
            </p>
          )}
          <div className="mt-5">
            <ShopForm
              initial={profile}
              onSave={(p) => {
                update(p);
                setEditing(false);
                window.scrollTo(0, 0);
              }}
              onSkip={() => (profile ? setEditing(false) : goToSection('home'))}
            />
          </div>
        </div>
      </section>
    );
  }

  const industry = INDUSTRIES.find((i) => i.id === profile.type);
  const typeName = industry ? t.industries.items[profile.type].name : '';
  const tips = s.tips[profile.type] || s.tips.other;
  const doneCount = tips.filter((_, i) => profile.done.includes(String(i))).length;
  const services = suggestedServices(profile, industry?.services || ['presence', 'branding', 'social']);
  const searchWord = INDUSTRY_SEARCH[profile.type] ? `${INDUSTRY_SEARCH[profile.type]} ` : '';
  const goalText = profile.goals.map((g) => s.form.goalOptions[g]).join(', ');

  const waMessage = composeMessage(ad.waIntro, [
    [ad.labels.type, typeName || t.contact.form.other],
    [ad.labels.sells, profile.sells],
    [ad.labels.city, profile.city],
    [ad.labels.age, profile.age ? s.form.ages[profile.age] : ''],
    [ad.labels.goals, goalText],
  ]);

  const toggleDone = (i) => {
    const key = String(i);
    update({ ...profile, done: profile.done.includes(key) ? profile.done.filter((d) => d !== key) : [...profile.done, key] });
  };

  return (
    <section className="section-y bg-paper">
      <div className="container-x max-w-[60rem]">
        {back}

        <header className="on-dark mt-5 rounded-[1.5rem] bg-forest p-5 text-white sm:p-8">
          <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-tile)] bg-sun text-forest">
            {industry ? <industry.icon className="h-6 w-6" aria-hidden="true" /> : <LuStore className="h-6 w-6" aria-hidden="true" />}
          </span>
          <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-[clamp(1.8rem,1.4rem+2vw,2.6rem)] font-extrabold text-white outline-none">
            {typeName ? fill(ad.title, { type: typeName }) : ad.titleOther}
          </h1>
          {profile.sells && <p className="mt-2 text-[1.1rem] text-on-dark">{fill(ad.sellsLine, { sells: profile.sells })}</p>}
          {(profile.city || goalText) && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {profile.city && <li className="chip !bg-white/10 !text-white">{profile.city}</li>}
              {profile.goals.map((g) => (
                <li key={g} className="chip !bg-white/10 !text-white">
                  {s.form.goalOptions[g]}
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="btn btn-ghost-light mt-5 !min-h-11" onClick={() => setEditing(true)}>
            <LuPencil className="h-4 w-4" aria-hidden="true" />
            {ad.edit}
          </button>
        </header>

        {/* Tips */}
        <section aria-labelledby="shop-tips-title" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="shop-tips-title" className="text-[1.6rem] font-bold text-forest">
                {ad.tipsTitle}
              </h2>
              <p className="mt-1 text-muted">{ad.tipsIntro}</p>
            </div>
            <p className="chip !text-[0.95rem]" role="status">
              {fill(ad.progress, { n: doneCount, total: tips.length })}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-mint" aria-hidden="true">
            <div className="h-full rounded-full bg-sun-deep transition-[width] duration-300" style={{ width: `${(doneCount / tips.length) * 100}%` }} />
          </div>
          <ul className="mt-5 grid gap-3">
            {tips.map(([title, text], i) => {
              const done = profile.done.includes(String(i));
              return (
                <li key={title}>
                  <label
                    className={`flex cursor-pointer gap-4 rounded-[var(--radius-card)] border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sun-deep sm:p-5 ${
                      done ? 'border-leaf/40 bg-mint' : 'border-line bg-white hover:border-leaf/50'
                    }`}
                  >
                    <input type="checkbox" className="sr-only" checked={done} onChange={() => toggleDone(i)} aria-label={fill(ad.markDone, { tip: title })} />
                    <span
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-colors ${done ? 'border-forest bg-forest text-sun' : 'border-[#9aa8a0] bg-white text-transparent'}`}
                      aria-hidden="true"
                    >
                      <LuCheck className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[1.15rem] font-bold text-forest">{title}</span>
                      <span className="mt-1 block text-muted">{text}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          {doneCount === tips.length && (
            <p role="status" className="mt-4 flex items-center gap-2 font-semibold text-leaf">
              <LuCircleCheck className="h-5 w-5" aria-hidden="true" />
              {ad.allDone}
            </p>
          )}
        </section>

        {/* Services */}
        <section aria-labelledby="shop-services-title" className="mt-10">
          <h2 id="shop-services-title" className="text-[1.6rem] font-bold text-forest">
            {ad.servicesTitle}
          </h2>
          <p className="mt-1 text-muted">{ad.servicesIntro}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {services.map((id) => {
              const Icon = SERVICES.find((x) => x.id === id)?.icon;
              const item = t.services.items[id];
              return (
                <li key={id}>
                  <button type="button" onClick={() => openService(id)} className="flex h-full w-full items-start gap-3.5 rounded-[var(--radius-card)] border border-line bg-white p-4 text-left transition-colors hover:border-leaf">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-sun-soft text-forest ring-1 ring-sun/60 ring-inset">{Icon && <Icon className="h-5 w-5" aria-hidden="true" />}</span>
                    <span>
                      <span className="block font-bold text-forest">{item.title}</span>
                      <span className="mt-0.5 block text-[0.95rem] leading-snug text-muted">{item.summary}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Ideas */}
        <section aria-labelledby="shop-ideas-title" className="mt-10">
          <h2 id="shop-ideas-title" className="text-[1.6rem] font-bold text-forest">
            {ad.ideasTitle}
          </h2>
          <p className="mt-1 text-muted">{ad.ideasIntro}</p>
          <ul className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white px-4 sm:px-5">
            {IDEA_KINDS.slice(0, 4).map((k) => {
              const label = t.tools.ideas.kinds[k.id];
              return (
                <li key={k.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3">
                  <span className="font-semibold text-forest">{label}</span>
                  <span className="flex gap-2">
                    <a href={pinterestUrl(`${searchWord}${k.pinterest}`)} {...external} aria-label={fill(t.tools.ideas.ideasAria, { thing: label })} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-paper px-3.5 text-[0.95rem] font-semibold text-forest ring-1 ring-line hover:ring-forest">
                      <FaPinterestP className="h-4 w-4 text-[#B7081B]" aria-hidden="true" />
                      {t.tools.ideas.ideasOn}
                    </a>
                    <a href={canvaUrl(`${searchWord}${k.canva}`)} {...external} aria-label={fill(t.tools.ideas.makeAria, { thing: label })} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-forest px-3.5 text-[0.95rem] font-semibold text-white hover:bg-leaf">
                      <LuPencilRuler className="h-4 w-4 text-sun" aria-hidden="true" />
                      {t.tools.ideas.makeOn}
                    </a>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[0.9rem] text-muted">{t.tools.disclaimer}</p>
        </section>

        {/* Help */}
        <section aria-labelledby="shop-help-title" className="mt-10 rounded-[var(--radius-card)] bg-sun-soft p-5 ring-1 ring-sun ring-inset sm:p-6">
          <h2 id="shop-help-title" className="text-[1.35rem] font-bold text-forest">
            {ad.helpTitle}
          </h2>
          <p className="mt-1 text-ink">{ad.helpText}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <WhatsAppButton message={waMessage} className="btn btn-wa w-full">
              {ad.whatsapp}
            </WhatsAppButton>
            <button
              type="button"
              className="btn btn-outline w-full"
              onClick={() =>
                prefillContact({
                  category: profile.type,
                  services,
                  message: [profile.sells && `${ad.labels.sells}: ${profile.sells}`, goalText && `${ad.labels.goals}: ${goalText}`].filter(Boolean).join('\n'),
                  source: 'my-shop',
                })
              }
            >
              <LuSend className="h-5 w-5 shrink-0" aria-hidden="true" />
              {ad.enquire}
            </button>
          </div>
        </section>

        {hasSupabase && (
          <div className="mt-10">
            <AccountCard session={session} onSession={connect} syncError={sync.error} synced={sync.done} />
          </div>
        )}

        <button
          type="button"
          className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-danger hover:underline"
          onClick={async () => {
            if (session) await deleteShopProfile(session);
            saveProfile(null);
            setProfile(null);
            setEditing(false);
            setCleared(true);
            window.scrollTo(0, 0);
          }}
        >
          <LuTrash2 className="h-4 w-4" aria-hidden="true" />
          {ad.clear}
        </button>
      </div>
    </section>
  );
}
