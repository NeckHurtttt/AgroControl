import { useCarga } from '../../../hooks/useCarga';
import type { Predio } from '../models/Predio';
import { predioService } from '../services/predioService';

// Loader fuera del componente: referencia estable para useCarga.
const cargarPredios = (signal: AbortSignal) => predioService.listar(signal);

export function usePredios() {
  const { datos: predios, setDatos: setPredios, loading, error, recargar } = useCarga<Predio[]>(cargarPredios, []);
  return { predios, setPredios, loading, error, recargar };
}
