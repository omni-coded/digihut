import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { LuMail, LuPhone, LuMapPin, LuLoaderCircle, LuCircleCheck, LuCircleAlert, LuPhoneCall, LuSend, LuInfo } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { useUI } from '../ui/UIContext';
import { SERVICES, INDUSTRIES } from '../content/data';
import { config, hasSupabase, hasTurnstile, hasWhatsApp, instagramUrl, whatsappDisplay } from '../config';
import { whatsappUrl } from '../lib/whatsapp';
import { submitLead } from '../lib/supabase';
import { validateLead, normalisePhone } from '../lib/validation';
import { composeMessage } from '../lib/whatsapp';
import SectionHeading from '../components/SectionHeading';
import WhatsAppButton from '../components/WhatsAppButton';
import Turnstile from '../components/Turnstile';

const EMPTY = { name: '', business: '', phone: '', category: '', services: [], city: '', message: '', website: '' };
const FIELD_ORDER = ['name', 'phone', 'category', 'message'];

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[0.95rem] font-medium text-danger">
      <LuCircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <li className="flex items-start gap-3.5 py-3.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-forest">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.9rem] font-semibold text-muted">{label}</p>
        <div className="text-[1.05rem] font-semibold text-forest [overflow-wrap:anywhere]">{children}</div>
      </div>
    </li>
  );
}

export default function Contact() {
  const { t, lang } = useLang();
  const { prefill } = useUI();
  const c = t.contact;
  const f = c.form;

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', mode: 'enquiry' });
  const meta = useRef({ source: 'contact', auditScore: null });
  const formRef = useRef(null);
  const statusRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaReset, setCaptchaReset] = useState(0);

  // Apply details sent from other sections (service sheet, pricing, audit…)
  useEffect(() => {
    if (!prefill) return;
    setValues((v) => ({
      ...v,
      category: prefill.category || v.category,
      services: prefill.services ? [...new Set([...v.services.filter((s) => s !== 'unsure'), ...prefill.services])] : v.services,
      message: prefill.message ? (v.message ? `${v.message}\n${prefill.message}` : prefill.message) : v.message,
    }));
    meta.current = { source: prefill.source || 'contact', auditScore: prefill.auditScore ?? null };
    setStatus({ state: 'idle', mode: 'enquiry' });
  }, [prefill]);

  useEffect(() => {
    if (['success', 'error', 'not_configured', 'rate_limited', 'captcha'].includes(status.state)) statusRef.current?.focus({ preventScroll: false });
  }, [status.state]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const toggleService = (id) => {
    setValues((v) => {
      let next = v.services.includes(id) ? v.services.filter((s) => s !== id) : [...v.services, id];
      if (id === 'unsure' && next.includes('unsure')) next = ['unsure'];
      else if (id !== 'unsure') next = next.filter((s) => s !== 'unsure');
      return { ...v, services: next };
    });
  };

  const categoryLabel = (id) => (id === 'other' ? f.other : t.industries.items[id]?.name || '');
  const serviceLabel = (id) => (id === 'unsure' ? f.notSure : t.services.items[id]?.title || id);

  const buildWhatsApp = (mode) =>
    composeMessage(mode === 'callback' ? c.waIntroCallback : c.waIntroEnquiry, [
      [c.labels.name, values.name.trim()],
      [c.labels.business, values.business.trim()],
      [c.labels.phone, values.phone.trim()],
      [c.labels.category, values.category ? categoryLabel(values.category) : ''],
      [c.labels.services, values.services.map(serviceLabel).join(', ')],
      [c.labels.city, values.city.trim()],
      [c.labels.message, values.message.trim()],
    ]);

  const submit = async (mode) => {
    if (status.state === 'submitting') return;
    const found = validateLead(values, mode);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ state: 'invalid', mode });
      const first = FIELD_ORDER.find((k) => found[k]);
      if (first) formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    if (values.website) {
      // Honeypot filled in — almost certainly a bot. Pretend nothing happened.
      setStatus({ state: 'idle', mode });
      return;
    }
    if (!hasSupabase) {
      setStatus({ state: 'not_configured', mode });
      return;
    }

    if (hasTurnstile && !captchaToken) {
      setStatus({ state: 'captcha', mode });
      return;
    }

    setStatus({ state: 'submitting', mode });
    const result = await submitLead({
      name: values.name.trim(),
      business_name: values.business.trim() || null,
      phone: normalisePhone(values.phone),
      category: values.category || null,
      services: values.services,
      city: values.city.trim() || null,
      message: values.message.trim() || null,
      type: mode,
      language: lang,
      source: meta.current.source,
      audit_score: meta.current.auditScore,
    }, captchaToken);
    if (hasTurnstile) setCaptchaReset((n) => n + 1); // tokens are single-use

    if (result.ok) {
      setStatus({ state: 'success', mode });
      setValues(EMPTY);
      setErrors({});
      meta.current = { source: 'contact', auditScore: null };
    } else if (result.reason === 'rate_limited') {
      setStatus({ state: 'rate_limited', mode });
    } else if (result.reason === 'captcha') {
      setStatus({ state: 'captcha', mode });
    } else {
      setStatus({ state: 'error', mode });
    }
  };

  const submitting = status.state === 'submitting';
  const errorText = (key) => (errors[key] ? c.errors[errors[key]] : '');

  const renderStatus = () => {
    const base = 'mb-6 rounded-2xl p-4 sm:p-5 outline-none';
    if (status.state === 'success') {
      const [title, body] = status.mode === 'callback' ? c.status.callback : c.status.success;
      return (
        <div ref={statusRef} tabIndex={-1} role="status" className={`${base} bg-mint ring-1 ring-leaf/30`}>
          <p className="flex items-center gap-2 text-[1.1rem] font-bold text-forest">
            <LuCircleCheck className="h-6 w-6 text-leaf" aria-hidden="true" />
            {title}
          </p>
          <p className="mt-1 text-ink">{body}</p>
        </div>
      );
    }
    if (status.state === 'error') {
      const [title, body] = c.status.error;
      return (
        <div ref={statusRef} tabIndex={-1} role="alert" className={`${base} bg-danger-soft ring-1 ring-danger/30`}>
          <p className="flex items-center gap-2 text-[1.1rem] font-bold text-danger">
            <LuCircleAlert className="h-6 w-6" aria-hidden="true" />
            {title}
          </p>
          <p className="mt-1 text-ink">{body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-forest !min-h-11" onClick={() => submit(status.mode)}>
              {c.status.tryAgain}
            </button>
            <WhatsAppButton message={buildWhatsApp(status.mode)} className="btn btn-wa !min-h-11">
              {c.status.sendOnWhatsApp}
            </WhatsAppButton>
          </div>
        </div>
      );
    }
    if (status.state === 'rate_limited' || status.state === 'captcha') {
      const [title, body] = c.status[status.state === 'captcha' ? 'captcha' : 'rateLimited'];
      return (
        <div ref={statusRef} tabIndex={-1} role="alert" className={`${base} bg-sun-soft ring-1 ring-sun`}>
          <p className="flex items-center gap-2 text-[1.1rem] font-bold text-forest">
            <LuInfo className="h-6 w-6" aria-hidden="true" />
            {title}
          </p>
          <p className="mt-1 text-ink">{body}</p>
          <WhatsAppButton message={buildWhatsApp(status.mode)} className="btn btn-wa mt-3 !min-h-11">
            {c.status.sendOnWhatsApp}
          </WhatsAppButton>
        </div>
      );
    }
    if (status.state === 'not_configured') {
      const [title, body] = c.status.notConfigured;
      return (
        <div ref={statusRef} tabIndex={-1} role="alert" className={`${base} bg-sun-soft ring-1 ring-sun`}>
          <p className="flex items-center gap-2 text-[1.1rem] font-bold text-forest">
            <LuInfo className="h-6 w-6" aria-hidden="true" />
            {title}
          </p>
          <p className="mt-1 text-ink">{body}</p>
          <WhatsAppButton message={buildWhatsApp(status.mode)} className="btn btn-wa mt-3 !min-h-11">
            {c.status.sendOnWhatsApp}
          </WhatsAppButton>
          <p className="mt-3 text-[0.85rem] text-muted" lang="en">
            {c.status.ownerHint}
          </p>
        </div>
      );
    }
    if (status.state === 'invalid') {
      return (
        <div ref={statusRef} tabIndex={-1} role="alert" className={`${base} bg-danger-soft ring-1 ring-danger/30`}>
          <p className="flex items-center gap-2 font-semibold text-danger">
            <LuCircleAlert className="h-5 w-5" aria-hidden="true" />
            {c.errors.summary}
          </p>
        </div>
      );
    }
    return null;
  };

  const optional = <span className="font-normal text-muted"> ({f.optional})</span>;

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        <div className="min-w-0">
          <SectionHeading id="contact-title" title={c.title} intro={c.intro} />

          <div className="on-dark mt-8 rounded-[var(--radius-card)] bg-forest p-6 text-white">
            <p className="text-[0.95rem] font-semibold text-sun">{c.fastest}</p>
            <p className="mt-1 text-[1.3rem] font-bold">{c.fastestText}</p>
            <WhatsAppButton message={c.waIntroEnquiry} className="btn btn-sun mt-4 w-full text-[1.1rem]">
              {c.chat}
            </WhatsAppButton>
          </div>

          <ul className="mt-4 divide-y divide-line">
            <InfoRow icon={FaInstagram} label={c.instagram}>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-sun-deep decoration-2 underline-offset-4 hover:text-leaf">
                @{config.instagramHandle}
              </a>
            </InfoRow>
            <InfoRow icon={LuMail} label={c.email}>
              {config.contactEmail ? (
                <a href={`mailto:${config.contactEmail}`} className="underline decoration-sun-deep decoration-2 underline-offset-4 hover:text-leaf">
                  {config.contactEmail}
                </a>
              ) : (
                <span className="text-muted">
                  hello@your-domain.in <span className="ml-1 rounded-full bg-paper px-2 py-0.5 text-[0.78rem] font-medium ring-1 ring-line">{c.placeholderTag}</span>
                </span>
              )}
            </InfoRow>
            {hasWhatsApp && (
              <InfoRow icon={FaWhatsapp} label={c.whatsappLabel}>
                <a href={whatsappUrl(c.waIntroEnquiry)} target="_blank" rel="noopener noreferrer" className="underline decoration-sun-deep decoration-2 underline-offset-4 hover:text-leaf">
                  {whatsappDisplay}
                </a>
              </InfoRow>
            )}
            {config.contactPhone && (
              <InfoRow icon={LuPhone} label={c.phone}>
                <a href={`tel:${config.contactPhone.replace(/[^\d+]/g, '')}`} className="underline decoration-sun-deep decoration-2 underline-offset-4 hover:text-leaf">
                  {config.contactPhone}
                </a>
              </InfoRow>
            )}
            <InfoRow icon={LuMapPin} label={c.location}>
              {c.locationValue}
            </InfoRow>
          </ul>
        </div>

        <div className="reveal min-w-0 rounded-[1.5rem] border border-line bg-paper p-5 sm:p-8">
          <h3 className="text-[1.5rem] font-bold text-forest">{f.title}</h3>
          <form
            ref={formRef}
            noValidate
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              submit('enquiry');
            }}
          >
            {renderStatus()}

            {/* honeypot: hidden from people, tempting for bots */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="lead-name" className="field-label">
                  {f.name}
                </label>
                <input
                  id="lead-name"
                  name="name"
                  className="field"
                  autoComplete="name"
                  value={values.name}
                  onChange={set('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'err-name' : undefined}
                  required
                />
                <FieldError id="err-name" message={errorText('name')} />
              </div>
              <div>
                <label htmlFor="lead-business" className="field-label">
                  {f.business}
                  {optional}
                </label>
                <input id="lead-business" name="business" className="field" autoComplete="organization" value={values.business} onChange={set('business')} />
              </div>
              <div>
                <label htmlFor="lead-phone" className="field-label">
                  {f.phone}
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={16}
                  className="field"
                  placeholder="98XXXXXXXX"
                  value={values.phone}
                  onChange={set('phone')}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'err-phone' : 'hint-phone'}
                  required
                />
                {errors.phone ? (
                  <FieldError id="err-phone" message={errorText('phone')} />
                ) : (
                  <p id="hint-phone" className="mt-1.5 text-[0.9rem] text-muted">
                    {f.phoneHint}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lead-city" className="field-label">
                  {f.city}
                  {optional}
                </label>
                <input
                  id="lead-city"
                  name="city"
                  className="field"
                  list="cg-cities"
                  autoComplete="address-level2"
                  placeholder={f.cityPlaceholder}
                  value={values.city}
                  onChange={set('city')}
                />
                <datalist id="cg-cities">
                  {c.cities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="lead-category" className="field-label">
                  {f.category}
                </label>
                <select
                  id="lead-category"
                  name="category"
                  className="field"
                  value={values.category}
                  onChange={set('category')}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? 'err-category' : undefined}
                  required
                >
                  <option value="">{f.categoryPlaceholder}</option>
                  {INDUSTRIES.map(({ id }) => (
                    <option key={id} value={id}>
                      {t.industries.items[id].name}
                    </option>
                  ))}
                  <option value="other">{f.other}</option>
                </select>
                <FieldError id="err-category" message={errorText('category')} />
              </div>

              <fieldset className="sm:col-span-2">
                <legend className="field-label">
                  {f.services}
                  {optional}
                </legend>
                <p className="-mt-1 mb-2.5 text-[0.9rem] text-muted">{f.servicesHint}</p>
                <div className="flex flex-wrap gap-2">
                  {[...SERVICES.map((s) => s.id), 'unsure'].map((id) => {
                    const checked = values.services.includes(id);
                    return (
                      <label
                        key={id}
                        className={`relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-[1rem] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sun-deep ${
                          checked ? 'border-forest bg-forest text-white' : 'border-line bg-white text-forest hover:border-leaf'
                        }`}
                      >
                        <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleService(id)} />
                        {checked && <LuCircleCheck className="h-4 w-4 text-sun" aria-hidden="true" />}
                        {serviceLabel(id)}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="sm:col-span-2">
                <label htmlFor="lead-message" className="field-label">
                  {f.message}
                  {optional}
                </label>
                <textarea
                  id="lead-message"
                  name="message"
                  rows={4}
                  maxLength={1200}
                  className="field min-h-[7.5rem] resize-y"
                  placeholder={f.messagePlaceholder}
                  value={values.message}
                  onChange={set('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'err-message' : undefined}
                />
                <FieldError id="err-message" message={errorText('message')} />
              </div>
            </div>

            {hasTurnstile && (
              <Turnstile
                siteKey={config.turnstileSiteKey}
                lang={lang}
                onToken={setCaptchaToken}
                resetKey={captchaReset}
                failedText={c.status.captchaLoadFailed}
              />
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button type="submit" className="btn btn-forest w-full sm:col-span-2" disabled={submitting} aria-busy={submitting && status.mode === 'enquiry'}>
                {submitting && status.mode === 'enquiry' ? (
                  <>
                    <LuLoaderCircle className="spin h-5 w-5" aria-hidden="true" />
                    {f.submitting}
                  </>
                ) : (
                  <>
                    <LuSend className="h-5 w-5" aria-hidden="true" />
                    {f.submit}
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline w-full"
                disabled={submitting}
                aria-busy={submitting && status.mode === 'callback'}
                onClick={() => submit('callback')}
              >
                {submitting && status.mode === 'callback' ? (
                  <LuLoaderCircle className="spin h-5 w-5" aria-hidden="true" />
                ) : (
                  <LuPhoneCall className="h-5 w-5" aria-hidden="true" />
                )}
                {submitting && status.mode === 'callback' ? f.submitting : f.callback}
              </button>
              <WhatsAppButton message={buildWhatsApp('enquiry')} className="btn btn-wa w-full">
                {c.chat}
              </WhatsAppButton>
            </div>
            <p className="mt-3 text-[0.92rem] text-muted">{f.callbackHint}</p>
            <p className="mt-2 text-[0.92rem] text-muted">
              {f.consent}{' '}
              <a href="#/privacy" className="font-semibold text-leaf underline underline-offset-4 hover:text-forest">
                {t.footer.privacy}
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
