import type { Cultivo } from '../../cultivos/models/Cultivo';
import type { Parcela } from '../../parcelas/models/Parcela';
import type { Predio } from '../../predios/models/Predio';
import type { Campana } from '../models/Campana';

// Datos de referencia para convertir ids en nombres legibles (como obtenerNombreCliente de la Guía 03).
export interface Catalogos {
  predios: Predio[];
  parcelas: Parcela[];
  cultivos: Cultivo[];
}

export function etiquetaParcela(parcelaId: number, catalogos: Catalogos): string {
  const parcela = catalogos.parcelas.find((item) => item.id === parcelaId);
  if (!parcela) return `Parcela ${parcelaId}`;
  const predio = catalogos.predios.find((item) => item.id === parcela.predioId);
  return `${predio?.nombre ?? 'Predio ?'} · ${parcela.codigo}`;
}

export function nombreCultivo(cultivoId: number, catalogos: Catalogos): string {
  return catalogos.cultivos.find((item) => item.id === cultivoId)?.nombre ?? `Cultivo ${cultivoId}`;
}

export function etiquetaCampana(campana: Campana, catalogos: Catalogos): string {
  return `${etiquetaParcela(campana.parcelaId, catalogos)} · ${nombreCultivo(campana.cultivoId, catalogos)}`;
}
