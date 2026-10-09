import { apiFetch } from '../../../api/apiClient';
import type { Insumo, MovimientoInsumo, TipoMovimiento } from '../models/Insumo';

export interface InsumoCreateRequest {
  nombre: string;
  unidadMedida: string;
}

export interface MovimientoRequest {
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string | null;
  usuarioId: number;
}

export const insumoService = {
  listar(signal?: AbortSignal): Promise<Insumo[]> {
    return apiFetch<Insumo[]>('/insumos', { signal });
  },

  crear(data: InsumoCreateRequest): Promise<Insumo> {
    return apiFetch<Insumo>('/insumos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  listarMovimientos(insumoId: number, signal?: AbortSignal): Promise<MovimientoInsumo[]> {
    return apiFetch<MovimientoInsumo[]>(`/insumos/${insumoId}/movimientos`, { signal });
  },

  registrarMovimiento(insumoId: number, data: MovimientoRequest): Promise<MovimientoInsumo> {
    return apiFetch<MovimientoInsumo>(`/insumos/${insumoId}/movimientos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
