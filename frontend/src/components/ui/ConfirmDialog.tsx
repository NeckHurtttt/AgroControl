import Button from './Button';
import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Eliminar',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Mientras se confirma, Escape y × no cierran: la acción ya está en curso.
  const cancelar = () => {
    if (!loading) onCancel();
  };

  return (
    <Modal open={open} title={title} onClose={cancelar}>
      <p className="confirm-dialog__message">{message}</p>
      <div className="form-actions">
        <Button variant="secondary" onClick={cancelar} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading} loadingText="Eliminando...">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
