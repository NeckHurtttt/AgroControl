// Fechas ISO del backend (2026-10-01 o 2026-10-01T13:16:11) a formato local dd/mm/aaaa.
export function formatFecha(iso: string | null): string {
  if (!iso) return '—';
  const [anio, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

export function formatCantidad(cantidad: number, unidad: string): string {
  return `${cantidad.toLocaleString('es-BO', { maximumFractionDigits: 2 })} ${unidad}`;
}

// Fecha de hoy en formato yyyy-mm-dd (zona horaria local), lista para un <input type="date">.
export function hoyISO(): string {
  const ahora = new Date();
  return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function validarCantidadPositiva(valor: string, etiqueta = 'La cantidad'): string | undefined {
  if (!valor.trim()) return `${etiqueta} es obligatoria.`;
  const numero = Number(valor);
  if (!Number.isFinite(numero) || numero <= 0) return `${etiqueta} debe ser mayor que cero.`;
  if (!/^\d{1,10}(\.\d{1,2})?$/.test(valor.trim())) return 'Use como maximo 2 decimales.';
  return undefined;
}
