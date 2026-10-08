export interface PaginaResultado<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

/**
 * Corta la lista ya filtrada. La página pedida se corrige al rango [1, totalPages],
 * así que borrar el último elemento de la última página muestra la anterior.
 */
export function paginar<T>(lista: T[], page: number, pageSize: number): PaginaResultado<T> {
  const totalItems = lista.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageValida = Math.min(Math.max(1, page), totalPages);
  const inicio = (pageValida - 1) * pageSize;
  return { items: lista.slice(inicio, inicio + pageSize), page: pageValida, totalPages, totalItems };
}
