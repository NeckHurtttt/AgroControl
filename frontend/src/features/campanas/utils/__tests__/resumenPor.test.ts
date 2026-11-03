import { describe, expect, it } from 'vitest';
import type { Cosecha } from '../../../cosechas/models/Cosecha';
import type { Parcela } from '../../../parcelas/models/Parcela';
import type { Campana } from '../../models/Campana';
import { resumenPor } from '../rendimiento';

const campana = (id: number, cultivoId: number, areaSembradaHa: number) => ({ id, cultivoId, parcelaId: 1, areaSembradaHa }) as Campana;
const cosecha = (campanaId: number, toneladas: number, anulado = false) =>
  ({ campanaId, toneladas, anulado, humedadPct: null, impurezasPct: null }) as Cosecha;
const parcelas = [{ id: 1, areaHa: 100 }] as Parcela[];

describe('resumenPor', () => {
  it('suma por grupo, de mayor a menor, y pondera por superficie', () => {
    const campanas = [campana(1, 7, 10), campana(2, 7, 30), campana(3, 8, 100)];
    const resultado = resumenPor(campanas, [cosecha(1, 20), cosecha(2, 60), cosecha(3, 300)], parcelas, [], (c) => c.cultivoId);
    expect(resultado).toEqual([
      { clave: 8, toneladas: 300, rendimiento: 3 },
      { clave: 7, toneladas: 80, rendimiento: 2 },
    ]);
  });

  it('ignora lo anulado y la superficie de campañas sin cosecha', () => {
    const campanas = [campana(1, 7, 10), campana(2, 7, 90)];
    const resultado = resumenPor(campanas, [cosecha(1, 20), cosecha(2, 500, true)], parcelas, [], (c) => c.cultivoId);
    expect(resultado).toEqual([{ clave: 7, toneladas: 20, rendimiento: 2 }]);
  });
});
