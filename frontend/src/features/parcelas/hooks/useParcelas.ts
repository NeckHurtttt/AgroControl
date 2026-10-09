import { useCallback } from 'react';
import { useCarga } from '../../../hooks/useCarga';
import { predioService } from '../../predios/services/predioService';
import type { Parcela } from '../models/Parcela';
import { parcelaService } from '../services/parcelaService';

// Predios se necesitan para mostrar a qué fundo pertenece cada parcela y llenar los selects.
const cargarParcelasYPredios = async (signal: AbortSignal) => {
  const [parcelas, predios] = await Promise.all([
    parcelaService.listar(signal),
    predioService.listar(signal),
  ]);
  return { parcelas, predios };
};

export function useParcelas() {
  const { datos, setDatos, loading, error, recargar } = useCarga(cargarParcelasYPredios, { parcelas: [], predios: [] });

  const setParcelas = useCallback(
    (actualizar: (prev: Parcela[]) => Parcela[]) =>
      setDatos((prev) => ({ ...prev, parcelas: actualizar(prev.parcelas) })),
    [setDatos],
  );

  return { parcelas: datos.parcelas, predios: datos.predios, setParcelas, loading, error, recargar };
}
