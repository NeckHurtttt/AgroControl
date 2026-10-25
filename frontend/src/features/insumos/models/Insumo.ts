export type CategoriaInsumo =
  | 'SEMILLA' | 'FERTILIZANTE' | 'AGROQUIMICO' | 'COMBUSTIBLE' | 'LUBRICANTE' | 'REPUESTO' | 'OTRO';

// Orden, nombre e ícono con que se muestra cada categoría en todas las pantallas
export const CATEGORIAS: { valor: CategoriaInsumo; nombre: string; icono: string; unidad: string }[] = [
  { valor: 'SEMILLA', nombre: 'Semillas', icono: '🌱', unidad: 'kg' },
  { valor: 'FERTILIZANTE', nombre: 'Fertilizantes', icono: '🧪', unidad: 'kg' },
  { valor: 'AGROQUIMICO', nombre: 'Agroquímicos', icono: '🧴', unidad: 'L' },
  { valor: 'COMBUSTIBLE', nombre: 'Combustibles', icono: '⛽', unidad: 'L' },
  { valor: 'LUBRICANTE', nombre: 'Aceites y grasas', icono: '🛢️', unidad: 'L' },
  { valor: 'REPUESTO', nombre: 'Repuestos', icono: '🔧', unidad: 'unidad' },
  { valor: 'OTRO', nombre: 'Otros', icono: '📦', unidad: 'unidad' },
];

export const categoria = (valor: CategoriaInsumo) => CATEGORIAS.find((c) => c.valor === valor) ?? CATEGORIAS[CATEGORIAS.length - 1];

export interface Insumo {
  id: number;
  nombre: string;
  unidadMedida: string;
  stockActual: number;
  categoria: CategoriaInsumo;
  stockMinimo: number;
  porAgotarse: boolean;
}

// GET /api/insumos/salidas: lo que salió del almacén en el período
export interface SalidaDeAlmacen {
  insumoId: number;
  nombre: string;
  categoria: CategoriaInsumo;
  unidadMedida: string;
  cantidad: number;
  movimientos: number;
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
