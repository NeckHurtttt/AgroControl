import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { vigilarFormularios } from '../../../shared/utils/formulariosSucios';
import Modal from '../Modal';

function Prueba({ onClose }: { onClose: () => void }) {
  useEffect(() => vigilarFormularios(), []);
  return (
    <Modal open title="Editar" onClose={onClose}>
      <form><input aria-label="Nombre" /></form>
    </Modal>
  );
}

describe('Modal con formulario a medias', () => {
  beforeAll(() => {
    // jsdom no implementa showModal
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.open = true;
    };
  });

  it('cierra directo si no se escribió nada', async () => {
    const onClose = vi.fn();
    render(<Prueba onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar', hidden: true }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('pregunta antes de descartar lo escrito', async () => {
    const onClose = vi.fn();
    render(<Prueba onClose={onClose} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Nombre', hidden: true }), 'Lote 4');
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar', hidden: true }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Seguir editando', hidden: true }));
    expect(screen.queryByText('Hay cambios sin guardar.')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar', hidden: true }));
    await userEvent.click(screen.getByRole('button', { name: 'Descartar', hidden: true }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
