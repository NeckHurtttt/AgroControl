import { apiFetch } from '../../../api/apiClient';
import type { RolCatalogo } from '../models/Rol';

export const rolService = {
  listar(signal?: AbortSignal): Promise<RolCatalogo[]> {
    return apiFetch<RolCatalogo[]>('/roles', { signal });
  },
};
