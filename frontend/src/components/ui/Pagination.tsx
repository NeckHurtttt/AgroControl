import { useId } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const id = useId();
  const desde = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const hasta = Math.min(page * pageSize, totalItems);

  return (
    <nav className="pagination" aria-label="Paginación">
      <p className="pagination__info">
        {desde}–{hasta} de {totalItems}
      </p>
      <div className="pagination__controls">
        <button type="button" className="btn-secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Anterior
        </button>
        <span aria-current="page">
          Página {page} de {totalPages}
        </span>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Siguiente
        </button>
      </div>
      <div className="pagination__size">
        <label htmlFor={id}>Por página</label>
        <select id={id} value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
