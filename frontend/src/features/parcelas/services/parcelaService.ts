import { apiFetch } from '../../../api/apiClient';
import type { Parcela } from '../models/Parcela';
import type { ParcelaCreateRequest } from '../types/ParcelaCreateRequest';
import type { ParcelaUpdateRequest } from '../types/ParcelaUpdateRequest';

export const parcelaService = {
  listar(signal?: AbortSignal): Promise<Parcela[]> {
    return apiFetch<Parcela[]>('/parcelas', { signal });
  },

  obtenerPorId(id: number, signal?: AbortSignal): Promise<Parcela> {
    return apiFetch<Parcela>(`/parcelas/${id}`, { signal });
  },

  crear(data: ParcelaCreateRequest): Promise<Parcela> {
    return apiFetch<Parcela>('/parcelas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  actualizar(id: number, data: ParcelaUpdateRequest): Promise<Parcela> {
    return apiFetch<Parcela>(`/parcelas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  eliminar(id: number): Promise<void> {
    return apiFetch<void>(`/parcelas/${id}`, { method: 'DELETE' });
  },
};
