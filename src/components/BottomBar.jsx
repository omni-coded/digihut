import { FaWhatsapp } from 'react-icons/fa6';
import { LuHouse, LuLayoutGrid, LuGauge, LuWrench } from 'react-icons/lu';
import { useLang } from '../i18n/LanguageContext';
import { ALL_SECTIONS } from '../content/data';
import { goToSection } from '../lib/scroll';
import useActiveSection from '../hooks/useActiveSection';
import WhatsAppButton from './WhatsAppButton';

// Which tab lights up for each section of the page.
const TAB_FOR = { home: 'home', services: 'services', industries: 'services', portfolio: 'services', pricing: 'services', audit: 'audit', tools: 'tools' };

/** Thumb-reach navigation for phones: the four most-used places plus WhatsApp. */
export default function BottomBar({ onHome }) {
  const { t } = useLang();
  const active = useActiveSection(ALL_SECTIONS, onHome);
  const current = onHome ? TAB_FOR[active] : null;

  const tabs = [
    { id: 'home', label: t.nav.home, icon: LuHouse },
    { id: 'services', label: t.nav.services, icon: LuLayoutGrid },
    { id: 'audit', label: t.nav.checkShort, icon: LuGauge },
    { id: 'tools', label: t.nav.tools, icon: LuWrench },
  ];

  return (
    <nav aria-label={t.nav.bottomNav} className="bottom-bar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur-sm lg:hidden">
      <ul className="mx-auto grid max-w-[34rem] grid-cols-5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = current === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(id);
                }}
                aria-current={isActive ? 'location' : undefined}
                className={`tab relative flex h-[3.75rem] flex-col items-center justify-center gap-0.5 px-1 text-[0.72rem] font-semibold leading-tight ${
                  isActive ? 'is-active text-forest' : 'text-muted'
                }`}
              >
                <Icon className="h-[1.4rem] w-[1.4rem]" aria-hidden="true" />
                <span className="max-w-full truncate">{label}</span>
              </a>
            </li>
          );
        })}
        <li>
          <WhatsAppButton
            message={t.contact.waIntroEnquiry}
            icon={false}
            ariaLabel={t.common.chatAria}
            className="flex h-[3.75rem] w-full flex-col items-center justify-center gap-0.5 px-1 text-[0.72rem] font-semibold leading-tight text-leaf"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-leaf text-white">
              <FaWhatsapp className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
            </span>
            <span className="max-w-full truncate">{t.nav.chatShort}</span>
          </WhatsAppButton>
        </li>
      </ul>
    </nav>
  );
}
