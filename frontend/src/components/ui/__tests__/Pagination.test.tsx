import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Pagination from '../Pagination';

const props = {
  totalItems: 25,
  pageSize: 10,
  onPageSizeChange: vi.fn(),
};

describe('Pagination', () => {
  it('Siguiente llama a onPageChange con la página 2', async () => {
    const onPageChange = vi.fn();
    render(<Pagination {...props} page={1} totalPages={3} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('deshabilita Anterior en la primera página y Siguiente en la última', () => {
    const { rerender } = render(<Pagination {...props} page={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByRole('navigation', { name: 'Paginación' })).toBeInTheDocument();

    rerender(<Pagination {...props} page={3} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
    expect(screen.getByText('21–25 de 25')).toBeInTheDocument();
  });

  it('avisa el nuevo tamaño de página como número', async () => {
    const onPageSizeChange = vi.fn();
    render(<Pagination {...props} page={1} totalPages={3} onPageChange={vi.fn()} onPageSizeChange={onPageSizeChange} />);

    await userEvent.selectOptions(screen.getByLabelText('Por página'), '20');

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });
});
