import { apiFetch } from '../../../api/apiClient';
import type { Parcela } from '../models/Parcela';
import type { ParcelaCreateRequest } from '../types/ParcelaCreateRequest';

export const parcelaService = {
  listar(signal?: AbortSignal): Promise<Parcela[]> {
    return apiFetch<Parcela[]>('/parcelas', { signal });
  },

  crear(data: ParcelaCreateRequest): Promise<Parcela> {
    return apiFetch<Parcela>('/parcelas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
