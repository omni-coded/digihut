import { useEffect, useRef } from 'react';
import { LuX } from 'react-icons/lu';

/**
 * Accessible sheet built on the native <dialog> element: focus is trapped,
 * Esc closes it, and it slides up from the bottom on phones.
 */
export default function Modal({ open, onClose, labelledBy, closeLabel = 'Close', children }) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    const handleClose = () => {
      document.documentElement.style.overflow = '';
      onCloseRef.current?.();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      document.documentElement.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close();
      }}
    >
      {open && (
        <div className="relative max-h-[inherit] overflow-y-auto overscroll-contain px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line sm:hidden" aria-hidden="true" />
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-forest hover:bg-mint"
            aria-label={closeLabel}
          >
            <LuX className="h-6 w-6" aria-hidden="true" />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
