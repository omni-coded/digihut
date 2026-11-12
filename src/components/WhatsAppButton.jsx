import { FaWhatsapp } from 'react-icons/fa6';
import { whatsappUrl } from '../lib/whatsapp';
import { useUI } from '../ui/UIContext';

/**
 * Opens WhatsApp with a prepared message. If no WhatsApp number is configured
 * yet, it explains that instead of opening a broken or wrong chat.
 */
export default function WhatsAppButton({ message = '', className = 'btn btn-wa', children, icon = true, ariaLabel, onBeforeOpen }) {
  const { showWhatsAppNotice } = useUI();
  const url = whatsappUrl(message);
  const content = (
    <>
      {icon && <FaWhatsapp className="h-5 w-5 shrink-0" aria-hidden="true" />}
      {children}
    </>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel} onClick={onBeforeOpen}>
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() => {
        onBeforeOpen?.();
        showWhatsAppNotice(message);
      }}
    >
      {content}
    </button>
  );
}
