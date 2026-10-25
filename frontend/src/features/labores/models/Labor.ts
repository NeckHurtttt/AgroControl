export type EstadoLabor = 'PLANIFICADA' | 'EJECUTADA';

export interface Labor {
  id: number;
  campanaId: number;
  parcelaId: number;
  tipo: string;
  fechaPlan: string;
  fechaEjecucion: string | null;
  estado: EstadoLabor;
}

export interface AsignacionLabor {
  id: number;
  laborId: number;
  usuarioId: number;
  asignadoEn: string;
}

export interface ConsumoLabor {
  id: number;
  laborId: number;
  insumoId: number;
  cantidad: number;
  fecha: string;
}

export const TIPOS_LABOR = ['SIEMBRA', 'FERTILIZACION', 'FUMIGACION', 'RIEGO', 'CONTROL_MALEZAS', 'COSECHA', 'OTRA'];
