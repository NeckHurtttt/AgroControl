import { apiFetch } from '../../../api/apiClient';
import type { Cosecha } from '../models/Cosecha';

// usuarioId no se envía: el backend lo toma del token
export type CosechaCreateRequest = Omit<Cosecha, 'id' | 'fecha' | 'usuarioId'>;

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
