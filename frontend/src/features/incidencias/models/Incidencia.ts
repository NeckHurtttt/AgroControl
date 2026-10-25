export type EstadoIncidencia = 'ABIERTA' | 'EN_ATENCION' | 'RESUELTA';

export interface Incidencia {
  id: number;
  parcelaId: number | null;
  campanaId: number | null;
  laborId: number | null;
  descripcion: string;
  usuarioId: number;
  fecha: string;
  estado: EstadoIncidencia;
  resolucion: string | null;
  resueltaEn: string | null;
}
