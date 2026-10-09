import { useEffect, useId, useRef, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * <dialog> nativo abierto con showModal(): trae foco atrapado, fondo inerte y Escape.
 * El estado `open` del padre es la única fuente de verdad: Escape y × solo llaman a onClose,
 * y el efecto cierra el <dialog>. Así no hay doble cierre ni un evento `close` que repita onClose.
 */
export default function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(e) => {
        // Escape dispara 'cancel': evitamos que el navegador cierre por su cuenta y avisamos al padre.
        e.preventDefault();
        onClose();
      }}
    >
      {open && (
        <>
          <header className="modal__header">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="modal__close" aria-label="Cerrar" onClick={onClose}>
              ×
            </button>
          </header>
          <div className="modal__body">{children}</div>
        </>
      )}
    </dialog>
  );
}
