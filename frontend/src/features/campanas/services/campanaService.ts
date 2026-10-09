import { apiFetch } from '../../../api/apiClient';
import type { Campana } from '../models/Campana';

export type CampanaCreateRequest = Pick<Campana, 'parcelaId' | 'cultivoId' | 'fechaInicio'>;

export const campanaService = {
  listar(signal?: AbortSignal): Promise<Campana[]> {
    return apiFetch<Campana[]>('/campanas', { signal });
  },

  crear(data: CampanaCreateRequest): Promise<Campana> {
    return apiFetch<Campana>('/campanas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  iniciar(id: number): Promise<Campana> {
    return apiFetch<Campana>(`/campanas/${id}/iniciar`, { method: 'POST' });
  },

  finalizar(id: number, fechaFin: string): Promise<Campana> {
    return apiFetch<Campana>(`/campanas/${id}/finalizar`, {
      method: 'POST',
      body: JSON.stringify({ fechaFin }),
    });
  },
};
