import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import Button from './Button';
import { hayCambiosSinGuardar } from '../../shared/utils/formulariosSucios';

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
  const [confirmando, setConfirmando] = useState(false);
  if (!open && confirmando) setConfirmando(false);

  // × y Escape no descartan un formulario a medias sin preguntar; "Cancelar" ya es una decisión.
  const pedirCierre = () => {
    if (ref.current && hayCambiosSinGuardar(ref.current)) setConfirmando(true);
    else onClose();
  };

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
        pedirCierre();
      }}
    >
      {open && (
        <>
          <header className="modal__header">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="modal__close" aria-label="Cerrar" onClick={pedirCierre}>
              ×
            </button>
          </header>
          {confirmando && (
            <div className="modal__descarte" role="alert">
              <span>Hay cambios sin guardar.</span>
              <Button variant="secondary" size="sm" onClick={() => setConfirmando(false)}>Seguir editando</Button>
              <Button variant="danger" size="sm" onClick={onClose}>Descartar</Button>
            </div>
          )}
          <div className="modal__body">{children}</div>
        </>
      )}
    </dialog>
  );
}
