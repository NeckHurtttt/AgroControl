import { coincideBusqueda } from '../../../shared/utils/texto';
import type { Predio } from '../../predios/models/Predio';
import type { EstadoParcela, Parcela } from '../models/Parcela';

export interface FiltrosParcela {
  busqueda: string;
  predioId: number | null;
  estado: EstadoParcela | '';
}

// Búsqueda por código o nombre del predio (vía el Map) + filtros por predio y estado.
export function filtrarParcelas(
  parcelas: Parcela[],
  prediosPorId: Map<number, Predio>,
  { busqueda, predioId, estado }: FiltrosParcela,
): Parcela[] {
  return parcelas.filter(
    (parcela) =>
      (predioId === null || parcela.predioId === predioId) &&
      (!estado || parcela.estado === estado) &&
      coincideBusqueda(busqueda, parcela.codigo, prediosPorId.get(parcela.predioId)?.nombre),
  );
}
