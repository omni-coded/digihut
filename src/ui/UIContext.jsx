import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { goToSection } from '../lib/scroll';

const UIContext = createContext(null);

/**
 * Shared UI actions so any section (or the footer) can open a service or
 * industry sheet, or jump to the contact form with details already filled in.
 */
export function UIProvider({ children }) {
  const [modal, setModal] = useState(null); // { type: 'service' | 'industry' | 'whatsapp', id?, message? }
  const [prefill, setPrefill] = useState(null); // { nonce, services, category, message, source }

  const closeModal = useCallback(() => setModal(null), []);
  const openService = useCallback((id) => setModal({ type: 'service', id }), []);
  const openIndustry = useCallback((id) => setModal({ type: 'industry', id }), []);
  const showWhatsAppNotice = useCallback((message) => setModal({ type: 'whatsapp', message }), []);

  const prefillContact = useCallback((data = {}) => {
    setModal(null);
    setPrefill({ ...data, nonce: Date.now() });
    // Wait a frame so a closing sheet doesn't fight the scroll.
    window.requestAnimationFrame(() => goToSection('contact', { focusSelector: '#lead-name' }));
  }, []);

  const value = useMemo(
    () => ({ modal, closeModal, openService, openIndustry, showWhatsAppNotice, prefill, prefillContact }),
    [modal, closeModal, openService, openIndustry, showWhatsAppNotice, prefill, prefillContact],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}
