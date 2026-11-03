import { toneladasNetas } from '../../cosechas/utils/neto';
import type { Cosecha } from '../../cosechas/models/Cosecha';
import type { Cultivo } from '../../cultivos/models/Cultivo';
import type { Parcela } from '../../parcelas/models/Parcela';
import { sinAnulados } from '../../../shared/utils/estados';
import type { Campana } from '../models/Campana';

// Lo sembrado de verdad; sin ese dato, toda la parcela (igual que el backend en el avance).
export function superficie(campana: Campana, parcelas: Parcela[]): number | null {
  return campana.areaSembradaHa ?? parcelas.find((parcela) => parcela.id === campana.parcelaId)?.areaHa ?? null;
}

// Toneladas netas por hectárea de cada campaña con cosecha registrada (igual que el backend en el avance).
export function rendimientos(campanas: Campana[], cosechas: Cosecha[], parcelas: Parcela[], cultivos: Cultivo[] = []): Record<number, number> {
  const vigentes = sinAnulados(cosechas);
  const resultado: Record<number, number> = {};
  for (const campana of campanas) {
    const area = superficie(campana, parcelas);
    const estandar = cultivos.find((cultivo) => cultivo.id === campana.cultivoId)?.humedadEstandarPct ?? null;
    const toneladas = vigentes
      .filter((cosecha) => cosecha.campanaId === campana.id)
      .reduce((suma, cosecha) => suma + toneladasNetas(cosecha, estandar), 0);
    if (area && toneladas > 0) resultado[campana.id] = toneladas / area;
  }
  return resultado;
}

export interface Resumen<K> {
  clave: K;
  toneladas: number;
  rendimiento: number;
}

// Cosecha neta agrupada (por cultivo, por parcela...), de mayor a menor. Solo pesa la superficie
// de las campañas con cosecha: una campaña recién sembrada no baja el rendimiento.
export function resumenPor<K>(
  campanas: Campana[],
  cosechas: Cosecha[],
  parcelas: Parcela[],
  cultivos: Cultivo[],
  grupo: (campana: Campana) => K,
): Resumen<K>[] {
  const vigentes = sinAnulados(cosechas);
  const grupos = new Map<K, { toneladas: number; area: number }>();
  for (const campana of campanas) {
    const estandar = cultivos.find((cultivo) => cultivo.id === campana.cultivoId)?.humedadEstandarPct ?? null;
    const toneladas = vigentes
      .filter((cosecha) => cosecha.campanaId === campana.id)
      .reduce((suma, cosecha) => suma + toneladasNetas(cosecha, estandar), 0);
    if (toneladas <= 0) continue;
    const clave = grupo(campana);
    const actual = grupos.get(clave) ?? { toneladas: 0, area: 0 };
    grupos.set(clave, { toneladas: actual.toneladas + toneladas, area: actual.area + (superficie(campana, parcelas) ?? 0) });
  }
  return [...grupos.entries()]
    .map(([clave, { toneladas, area }]) => ({ clave, toneladas, rendimiento: area > 0 ? toneladas / area : 0 }))
    .sort((a, b) => b.toneladas - a.toneladas);
}
