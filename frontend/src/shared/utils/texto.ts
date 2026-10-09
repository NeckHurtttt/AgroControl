// Minúsculas y sin tildes, para que "jose" encuentre "José".
export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** true si la búsqueda está vacía o aparece en alguno de los campos. */
export function coincideBusqueda(busqueda: string, ...campos: (string | null | undefined)[]): boolean {
  const termino = normalizarTexto(busqueda);
  if (!termino) return true;
  return campos.some((campo) => campo != null && normalizarTexto(campo).includes(termino));
}
