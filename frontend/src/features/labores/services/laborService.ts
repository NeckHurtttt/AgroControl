import { apiFetch } from '../../../api/apiClient';
import type { ConsumoLabor, Labor } from '../models/Labor';

export type LaborCreateRequest = Pick<Labor, 'campanaId' | 'tipo' | 'fechaPlan'>;

export interface ConsumoRequest {
  insumoId: number;
  cantidad: number;
  usuarioId: number;
}

export const laborService = {
  listar(signal?: AbortSignal): Promise<Labor[]> {
    return apiFetch<Labor[]>('/labores', { signal });
  },

  planificar(data: LaborCreateRequest): Promise<Labor> {
    return apiFetch<Labor>('/labores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  ejecutar(id: number, fechaEjecucion: string): Promise<Labor> {
    return apiFetch<Labor>(`/labores/${id}/ejecutar`, {
      method: 'POST',
      body: JSON.stringify({ fechaEjecucion }),
    });
  },

  listarConsumos(laborId: number, signal?: AbortSignal): Promise<ConsumoLabor[]> {
    return apiFetch<ConsumoLabor[]>(`/labores/${laborId}/consumos`, { signal });
  },

  registrarConsumo(laborId: number, data: ConsumoRequest): Promise<ConsumoLabor> {
    return apiFetch<ConsumoLabor>(`/labores/${laborId}/consumos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
