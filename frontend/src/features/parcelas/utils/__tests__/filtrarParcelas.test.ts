import { describe, expect, it } from 'vitest';
import type { Predio } from '../../../predios/models/Predio';
import type { Parcela } from '../../models/Parcela';
import { filtrarParcelas } from '../filtrarParcelas';

const predios: Predio[] = [
  { id: 1, nombre: 'Fundo San José', ubicacion: null, areaHa: 120, activo: true },
  { id: 2, nombre: 'Fundo Las Palmeras', ubicacion: null, areaHa: 85.5, activo: true },
];
const prediosPorId = new Map(predios.map((predio) => [predio.id, predio]));
const parcelas: Parcela[] = [
  { id: 1, predioId: 1, codigo: 'P-01', areaHa: 45, estado: 'DISPONIBLE' },
  { id: 2, predioId: 1, codigo: 'P-02', areaHa: 30, estado: 'EN_PRODUCCION' },
  { id: 3, predioId: 2, codigo: 'P-01', areaHa: 50, estado: 'DISPONIBLE' },
];

const sinFiltros = { busqueda: '', predioId: null, estado: '' } as const;

describe('filtrarParcelas', () => {
  it('busca por nombre del predio sin importar tildes ni mayúsculas', () => {
    const resultado = filtrarParcelas(parcelas, prediosPorId, { ...sinFiltros, busqueda: 'jose' });
    expect(resultado.map((p) => p.id)).toEqual([1, 2]);
  });

  it('busca por código', () => {
    const resultado = filtrarParcelas(parcelas, prediosPorId, { ...sinFiltros, busqueda: 'p-02' });
    expect(resultado.map((p) => p.id)).toEqual([2]);
  });

  it('combina filtro por predio y por estado', () => {
    const resultado = filtrarParcelas(parcelas, prediosPorId, { ...sinFiltros, predioId: 1, estado: 'DISPONIBLE' });
    expect(resultado.map((p) => p.id)).toEqual([1]);
  });
});
