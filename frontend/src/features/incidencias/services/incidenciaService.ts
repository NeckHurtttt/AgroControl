import { apiFetch } from '../../../api/apiClient';
import type { Incidencia } from '../models/Incidencia';

export type IncidenciaCreateRequest = Omit<Incidencia, 'id' | 'fecha' | 'usuarioId'>;

export const incidenciaService = {
  listar(signal?: AbortSignal): Promise<Incidencia[]> {
    return apiFetch<Incidencia[]>('/incidencias', { signal });
  },

  registrar(data: IncidenciaCreateRequest): Promise<Incidencia> {
    return apiFetch<Incidencia>('/incidencias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
