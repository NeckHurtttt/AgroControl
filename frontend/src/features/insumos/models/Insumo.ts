export interface Insumo {
  id: number;
  nombre: string;
  unidadMedida: string;
  stockActual: number;
}

export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export interface MovimientoInsumo {
  id: number;
  insumoId: number;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string | null;
  usuarioId: number;
  fecha: string;
}
