import { useEffect, useMemo, useRef, useState } from 'react';
import { LuChevronLeft, LuRotateCcw, LuCircleCheck, LuCircleAlert, LuCircleDot, LuSend } from 'react-icons/lu';
import { useLang, fill } from '../i18n/LanguageContext';
import { AUDIT_GAP_SERVICE, auditLevel, scoreAudit } from '../content/data';
import { useUI } from '../ui/UIContext';
import { composeMessage } from '../lib/whatsapp';
import WhatsAppButton from '../components/WhatsAppButton';

const R = 54;
const CIRC = 2 * Math.PI * R;

function Gauge({ score, label }) {
  const [shown, setShown] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(score);
      setCount(score);
      return undefined;
    }
    let raf = window.requestAnimationFrame(() => setShown(score));
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 900);
      setCount(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [score]);
  const level = auditLevel(score);
  const color = level === 'high' ? '#2C7A55' : level === 'mid' ? '#E8C42A' : '#E8893A';
  return (
    <div className="relative h-36 w-36 shrink-0" role="img" aria-label={label}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={R} fill="none" stroke="#E6EFE8" strokeWidth="12" />
        <circle
          cx="64"
          cy="64"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - shown / 100)}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.2,0.8,0.2,1)' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="font-display text-[2.6rem] font-extrabold leading-none text-forest" style={{ fontStretch: '110%' }}>
          {count}
        </span>
      </span>
    </div>
  );
}

export default function Audit() {
  const { t } = useLang();
  const { prefillContact, openService } = useUI();
  const s = t.audit;
  const questions = s.questions;
  const total = questions.length;

  const [step, setStep] = useState(0); // 0..total-1 = question, total = result
  const [answers, setAnswers] = useState({});
  const headingRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const done = step >= total;
  const score = useMemo(() => scoreAudit(answers), [answers]);
  const level = auditLevel(score);
  const gaps = questions.map(([id]) => id).filter((id) => answers[id] && answers[id] !== 'yes');
  const recommended = useMemo(() => {
    const ids = [...new Set(gaps.map((g) => AUDIT_GAP_SERVICE[g]))];
    return ids.length ? ids : ['insights'];
  }, [gaps.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (value) => {
    const id = questions[step][0];
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setStep((n) => n + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const gapText = gaps.map((g) => `• ${s.gaps[g]}`).join('\n');
  const waMessage = composeMessage(s.waIntro, [
    [s.waScore, `${score}/100`],
    [s.waGaps, gapText ? `\n${gapText}` : ''],
  ]);

  const options = [
    ['yes', s.options.yes],
    ['partly', s.options.partly],
    ['no', s.options.no],
  ];

  return (
    <section id="audit" aria-labelledby="audit-title" className="on-dark section-y relative overflow-hidden bg-forest text-white">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full border-[3rem] border-leaf/40"
        aria-hidden="true"
      />
      <div className="container-x relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
        <div>
          <h2 id="audit-title" className="h-section !text-white">
            {s.title}
          </h2>
          <p className="mt-4 max-w-[34rem] text-[1.15rem] leading-relaxed text-on-dark">{s.intro}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-[0.98rem] font-medium text-sun">
            <LuCircleDot className="h-4 w-4" aria-hidden="true" />
            {s.meta}
          </p>
        </div>

        <div className="reveal rounded-[1.5rem] bg-white p-5 text-ink shadow-[var(--shadow-lift)] sm:p-8">
          {!done ? (
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.95rem] font-semibold text-leaf">{fill(s.progress, { n: step + 1, total })}</p>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((n) => n - 1)}
                    className="inline-flex min-h-10 items-center gap-1 rounded-full px-2 text-[0.95rem] font-semibold text-forest hover:bg-mint"
                  >
                    <LuChevronLeft className="h-5 w-5" aria-hidden="true" />
                    {s.back}
                  </button>
                )}
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-mint"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={step}
                aria-label={fill(s.progress, { n: step + 1, total })}
              >
                <div className="h-full rounded-full bg-sun-deep transition-[width] duration-300" style={{ width: `${(step / total) * 100}%` }} />
              </div>

              <h3 ref={headingRef} tabIndex={-1} className="mt-7 text-[1.55rem] font-bold leading-snug text-forest outline-none sm:text-[1.75rem]">
                {questions[step][1]}
              </h3>
              <p className="mt-2 text-muted">{questions[step][2]}</p>

              <div className="mt-6 grid gap-3" role="group" aria-label={questions[step][1]}>
                {options.map(([value, label]) => {
                  const selected = answers[questions[step][0]] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => answer(value)}
                      aria-pressed={selected}
                      className={`flex min-h-14 items-center justify-between rounded-2xl border-2 px-5 text-left text-[1.15rem] font-semibold transition-colors ${
                        selected ? 'border-forest bg-forest text-white' : 'border-line bg-paper text-forest hover:border-leaf'
                      }`}
                    >
                      {label}
                      <span
                        className={`h-5 w-5 rounded-full border-2 ${selected ? 'border-sun bg-sun' : 'border-[#9aa8a0]'}`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div aria-live="polite">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                <Gauge score={score} label={fill(s.scoreAria, { score })} />
                <div>
                  <h3 ref={headingRef} tabIndex={-1} className="text-[1rem] font-semibold text-leaf outline-none">
                    {s.resultTitle} <span className="text-muted">({s.outOf})</span>
                  </h3>
                  <p className="mt-1 font-display text-[1.7rem] font-extrabold leading-tight text-forest">{s.levels[level][0]}</p>
                  <p className="mt-1.5 text-muted">{s.levels[level][1]}</p>
                </div>
              </div>

              <div className="mt-7 border-t border-line pt-6">
                <h4 className="text-[1.1rem] font-bold text-forest">{s.gapsTitle}</h4>
                {gaps.length === 0 ? (
                  <p className="mt-2 flex items-center gap-2 text-leaf">
                    <LuCircleCheck className="h-5 w-5" aria-hidden="true" />
                    {s.noGaps}
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2.5">
                    {gaps.map((g) => (
                      <li key={g} className="flex gap-2.5">
                        <LuCircleAlert className="mt-1 h-5 w-5 shrink-0 text-[#C9651C]" aria-hidden="true" />
                        <span>
                          {s.gaps[g]}
                          {answers[g] === 'partly' && <span className="text-muted"> ({s.options.partly})</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6">
                <h4 className="text-[1.1rem] font-bold text-forest">{s.recTitle}</h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {recommended.map((id) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => openService(id)}
                        className="chip min-h-10 !px-4 !text-[1rem] ring-1 ring-leaf/30 hover:bg-sun-soft"
                      >
                        {t.services.items[id].title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <WhatsAppButton message={waMessage} className="btn btn-wa w-full !whitespace-normal text-center">
                  {s.whatsapp}
                </WhatsAppButton>
                <button
                  type="button"
                  className="btn btn-outline w-full !whitespace-normal text-center"
                  onClick={() =>
                    prefillContact({
                      services: recommended,
                      message: `${s.waScore}: ${score}/100${gaps.length ? `\n${s.waGaps}: ${gaps.map((g) => s.gaps[g]).join(', ')}` : ''}`,
                      source: 'audit',
                      auditScore: score,
                    })
                  }
                >
                  <LuSend className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {s.enquire}
                </button>
              </div>
              <button type="button" onClick={restart} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-forest hover:text-leaf">
                <LuRotateCcw className="h-4 w-4" aria-hidden="true" />
                {s.retake}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
