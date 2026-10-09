export type EstadoParcela = 'DISPONIBLE' | 'EN_PRODUCCION' | 'EN_DESCANSO';

export interface Parcela {
  id: number;
  predioId: number;
  codigo: string;
  areaHa: number | null;
  estado: EstadoParcela;
}

export const ESTADOS_PARCELA: EstadoParcela[] = ['DISPONIBLE', 'EN_PRODUCCION', 'EN_DESCANSO'];
