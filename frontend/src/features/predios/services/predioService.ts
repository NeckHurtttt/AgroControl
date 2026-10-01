import { apiFetch } from '../../../api/apiClient';
import type { Predio } from '../models/Predio';
import type { PredioRequest } from '../types/PredioRequest';

export const predioService = {
  listar(signal?: AbortSignal): Promise<Predio[]> {
    return apiFetch<Predio[]>('/predios', { signal });
  },

  crear(data: PredioRequest): Promise<Predio> {
    return apiFetch<Predio>('/predios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  actualizar(id: number, data: PredioRequest): Promise<Predio> {
    return apiFetch<Predio>(`/predios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  eliminar(id: number): Promise<void> {
    return apiFetch<void>(`/predios/${id}`, { method: 'DELETE' });
  },
};
