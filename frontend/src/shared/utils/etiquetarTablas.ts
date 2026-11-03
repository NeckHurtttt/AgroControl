// En celular cada fila de tabla se muestra como tarjeta y el CSS necesita el título de cada
// celda. Se copia del encabezado aquí, en un solo lugar, para que valga para todas las tablas.
function etiquetar(contenedor: HTMLElement) {
  contenedor.querySelectorAll('table.data-table').forEach((tabla) => {
    const titulos = Array.from(tabla.querySelectorAll('thead th'), (th) => th.textContent ?? '');
    tabla.querySelectorAll('tbody tr').forEach((fila) => {
      Array.from(fila.children).forEach((celda, i) => {
        const titulo = titulos[i] ?? '';
        if (celda.getAttribute('data-etiqueta') !== titulo) celda.setAttribute('data-etiqueta', titulo);
      });
    });
  });
}

export function etiquetarTablas(contenedor: HTMLElement) {
  const observador = new MutationObserver(() => etiquetar(contenedor));
  observador.observe(contenedor, { childList: true, subtree: true });
  etiquetar(contenedor);
  return () => observador.disconnect();
}
