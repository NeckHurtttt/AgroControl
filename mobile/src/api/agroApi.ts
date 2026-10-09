import { apiFetch } from './apiClient';
import type { Campana, Consumo, Insumo, Labor, Parcela, Usuario } from './tipos';

export const agroApi = {
  listarLabores: () => apiFetch<Labor[]>('/labores'),
  obtenerLabor: (id: number) => apiFetch<Labor>(`/labores/${id}`),
  ejecutarLabor: (id: number, fechaEjecucion: string) =>
    apiFetch<Labor>(`/labores/${id}/ejecutar`, {
      method: 'POST',
      body: JSON.stringify({ fechaEjecucion }),
    }),
  listarConsumos: (laborId: number) => apiFetch<Consumo[]>(`/labores/${laborId}/consumos`),
  registrarConsumo: (laborId: number, insumoId: number, cantidad: number, usuarioId: number) =>
    apiFetch<Consumo>(`/labores/${laborId}/consumos`, {
      method: 'POST',
      body: JSON.stringify({ insumoId, cantidad, usuarioId }),
    }),
  listarInsumos: () => apiFetch<Insumo[]>('/insumos'),
  listarUsuarios: () => apiFetch<Usuario[]>('/usuarios'),
  listarParcelas: () => apiFetch<Parcela[]>('/parcelas'),
  listarCampanas: (parcelaId: number) => apiFetch<Campana[]>(`/campanas?parcelaId=${parcelaId}`),
};

// Fecha local en formato ISO (yyyy-MM-dd), como la espera LocalDate en el backend.
export function hoyIso(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
