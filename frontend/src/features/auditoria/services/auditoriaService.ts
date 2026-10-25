import { apiFetch } from '../../../api/apiClient';
import type { RegistroAuditoria } from '../models/Auditoria';

export const auditoriaService = {
  // El backend devuelve los últimos 500 cambios; el filtro por entidad se hace en el servidor
  listar(entidad: string, signal?: AbortSignal): Promise<RegistroAuditoria[]> {
    const query = entidad ? `?entidad=${encodeURIComponent(entidad)}` : '';
    return apiFetch<RegistroAuditoria[]>(`/auditoria${query}`, { signal });
  },
};
