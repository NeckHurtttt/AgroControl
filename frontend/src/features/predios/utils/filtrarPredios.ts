import { coincideBusqueda } from '../../../shared/utils/texto';
import type { Predio } from '../models/Predio';

export type FiltroEstadoPredio = 'todos' | 'activos' | 'inactivos';

// Búsqueda por nombre o ubicación + filtro de estado.
export function filtrarPredios(predios: Predio[], busqueda: string, estado: FiltroEstadoPredio): Predio[] {
  return predios.filter(
    (predio) =>
      (estado === 'todos' || predio.activo === (estado === 'activos')) &&
      coincideBusqueda(busqueda, predio.nombre, predio.ubicacion),
  );
}
