import { apiFetch } from '../../../api/apiClient';
import type { Cosecha } from '../models/Cosecha';

export type CosechaCreateRequest = Omit<Cosecha, 'id' | 'fecha'>;

export const cosechaService = {
  listar(signal?: AbortSignal): Promise<Cosecha[]> {
    return apiFetch<Cosecha[]>('/cosechas', { signal });
  },

  registrar(data: CosechaCreateRequest): Promise<Cosecha> {
    return apiFetch<Cosecha>('/cosechas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
