import { useLang } from '../i18n/LanguageContext';
import WhatsAppButton from './WhatsAppButton';

/** Always-available WhatsApp shortcut on desktop. Phones use the bottom bar instead. */
export default function FloatingWhatsApp() {
  const { t } = useLang();
  return (
    <div className="fixed bottom-6 right-6 z-30 hidden lg:block">
      <WhatsAppButton
        message={t.contact.waIntroEnquiry}
        ariaLabel={t.common.chatAria}
        className="flex h-14 items-center gap-2 rounded-full bg-leaf pl-4 pr-4 text-[1.05rem] font-semibold text-white shadow-[0_10px_28px_-10px_rgb(13_46_32/0.7)] ring-4 ring-white/70 hover:bg-forest sm:pr-5 [&>svg]:h-7 [&>svg]:w-7"
      >
        <span className="hidden sm:inline">{t.common.whatsapp}</span>
      </WhatsAppButton>
    </div>
  );
}
