export type EstadoCampana = 'PLANIFICADA' | 'EN_CURSO' | 'FINALIZADA';

export interface Campana {
  id: number;
  parcelaId: number;
  cultivoId: number;
  fechaInicio: string;
  fechaFin: string | null;
  estado: EstadoCampana;
}
