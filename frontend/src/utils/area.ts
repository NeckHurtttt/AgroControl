// Convierte el texto de un input de área a number, o null si está vacío.
export function parseArea(valor: string): number | null {
  return valor.trim() ? Number(valor) : null;
}

export function validarArea(valor: string): string | undefined {
  if (!valor.trim()) return undefined;
  const area = Number(valor);
  if (!Number.isFinite(area) || area <= 0) return 'El area debe ser un numero mayor que cero.';
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(valor.trim())) return 'Use como maximo 2 decimales.';
  return undefined;
}

export function formatArea(area: number | null): string {
  return area === null ? '—' : `${area.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`;
}
