import { FaInstagram } from 'react-icons/fa6';
import { LuCheck, LuSend } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { SERVICES, INDUSTRIES } from '../content/data';
import { useUI } from '../ui/UIContext';
import { composeMessage } from '../lib/whatsapp';
import { instagramUrl } from '../config';
import Modal from './Modal';
import WhatsAppButton from './WhatsAppButton';

function ServiceSheet({ id }) {
  const { t } = useLang();
  const { prefillContact } = useUI();
  const s = t.services;
  const item = s.items[id];
  const Icon = SERVICES.find((x) => x.id === id)?.icon;
  if (!item) return null;
  const message = composeMessage(s.waIntro, [[s.waServiceLabel, item.title]]);

  return (
    <div>
      <div className="flex items-center gap-4 pr-10">
        {Icon && (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-sun-soft text-forest ring-1 ring-sun ring-inset">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
        )}
        <h2 id="sheet-title" className="text-[1.6rem] font-bold text-forest">
          {item.title}
        </h2>
      </div>
      <p className="mt-4 text-[1.15rem] text-ink">{item.summary}</p>

      <h3 className="mt-6 text-[1rem] font-bold text-leaf">{s.includesTitle}</h3>
      <ul className="mt-3 space-y-2.5">
        {item.includes.map((line) => (
          <li key={line} className="flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-sun">
              <LuCheck className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl bg-paper px-4 py-3 ring-1 ring-line">
        <p className="text-[0.95rem] font-semibold text-leaf">{s.goodForTitle}</p>
        <p className="mt-0.5">{item.goodFor}</p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <WhatsAppButton message={message} className="btn btn-wa w-full">
          {s.ask}
        </WhatsAppButton>
        <button type="button" className="btn btn-outline w-full" onClick={() => prefillContact({ services: [id], source: `service-${id}` })}>
          <LuSend className="h-5 w-5" aria-hidden="true" />
          {s.enquire}
        </button>
      </div>
    </div>
  );
}

function IndustrySheet({ id }) {
  const { t } = useLang();
  const { prefillContact, openService } = useUI();
  const s = t.industries;
  const item = s.items[id];
  const meta = INDUSTRIES.find((x) => x.id === id);
  if (!item || !meta) return null;
  const Icon = meta.icon;
  const message = composeMessage(s.waIntro, [[s.waCategoryLabel, item.name]]);

  return (
    <div>
      <div className="flex items-center gap-4 pr-10">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-forest text-sun">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 id="sheet-title" className="text-[1.6rem] font-bold text-forest">
          {item.name}
        </h2>
      </div>

      <h3 className="mt-6 text-[1rem] font-bold text-leaf">{s.modalIntro}</h3>
      <ul className="mt-3 divide-y divide-line">
        {item.points.map(([title, desc]) => (
          <li key={title} className="flex gap-3 py-3">
            <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sun text-forest">
              <LuCheck className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-forest">{title}</p>
              <p className="text-muted">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="mt-4 text-[1rem] font-bold text-leaf">{s.relatedServices}</h3>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {meta.services.map((sid) => (
          <li key={sid}>
            <button type="button" className="chip min-h-10 !px-4 !text-[1rem] ring-1 ring-leaf/25 hover:bg-sun-soft" onClick={() => openService(sid)}>
              {t.services.items[sid].title}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="btn btn-forest w-full !whitespace-normal text-center"
          onClick={() => prefillContact({ category: id, services: meta.services, source: `industry-${id}` })}
        >
          {s.getThis}
        </button>
        <WhatsAppButton message={message} className="btn btn-wa w-full">
          {s.ask}
        </WhatsAppButton>
      </div>
    </div>
  );
}

function WhatsAppNotice({ message }) {
  const { t } = useLang();
  const c = t.common;
  return (
    <div>
      <h2 id="sheet-title" className="pr-10 text-[1.5rem] font-bold text-forest">
        {c.notConfiguredTitle}
      </h2>
      <p className="mt-3 text-ink">{c.notConfiguredBody}</p>
      {message && (
        <div className="mt-5">
          <p className="text-[0.95rem] font-semibold text-leaf">{c.messagePreview}</p>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-paper p-4 font-[inherit] text-[0.98rem] ring-1 ring-line">{message}</pre>
        </div>
      )}
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-forest mt-6 w-full">
        <FaInstagram className="h-5 w-5" aria-hidden="true" />
        {c.openInstagram}
      </a>
      <p className="mt-4 text-[0.85rem] text-muted" lang="en">
        {c.notConfiguredOwner}
      </p>
    </div>
  );
}

/** Renders whichever sheet is open. Lives at app level so the footer can open them too. */
export default function Sheets() {
  const { t } = useLang();
  const { modal, closeModal } = useUI();
  const open = Boolean(modal);
  return (
    <Modal open={open} onClose={closeModal} labelledBy="sheet-title" closeLabel={t.common.close}>
      {modal?.type === 'service' && <ServiceSheet key={modal.id} id={modal.id} />}
      {modal?.type === 'industry' && <IndustrySheet key={modal.id} id={modal.id} />}
      {modal?.type === 'whatsapp' && <WhatsAppNotice message={modal.message} />}
    </Modal>
  );
}
