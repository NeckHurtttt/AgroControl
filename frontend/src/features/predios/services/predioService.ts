import { apiFetch } from '../../../api/apiClient';
import type { Predio } from '../models/Predio';
import type { PredioCreateRequest } from '../types/PredioCreateRequest';

export const predioService = {
  listar(signal?: AbortSignal): Promise<Predio[]> {
    return apiFetch<Predio[]>('/predios', { signal });
  },

  crear(data: PredioCreateRequest): Promise<Predio> {
    return apiFetch<Predio>('/predios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
