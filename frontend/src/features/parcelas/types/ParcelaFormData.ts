import type { EstadoParcela } from '../models/Parcela';

export interface ParcelaFormData {
  codigo: string;
  areaHa: string;
  predioId: string;
  estado: EstadoParcela;
}
