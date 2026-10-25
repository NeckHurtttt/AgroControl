import { apiFetch } from '../../../api/apiClient';
import type { EntradaBitacora } from '../models/Bitacora';

export const bitacoraService = {
  listarDeLabor(laborId: number, signal?: AbortSignal): Promise<EntradaBitacora[]> {
    return apiFetch<EntradaBitacora[]>(`/labores/${laborId}/bitacora`, { signal });
  },

  // usuarioId no se envía: el backend lo toma del token
  registrar(laborId: number, observacion: string): Promise<EntradaBitacora> {
    return apiFetch<EntradaBitacora>(`/labores/${laborId}/bitacora`, {
      method: 'POST',
      body: JSON.stringify({ observacion }),
    });
  },

  listarDeParcela(parcelaId: number, signal?: AbortSignal): Promise<EntradaBitacora[]> {
    return apiFetch<EntradaBitacora[]>(`/parcelas/${parcelaId}/bitacora`, { signal });
  },
};
