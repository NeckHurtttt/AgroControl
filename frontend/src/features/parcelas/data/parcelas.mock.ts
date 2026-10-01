import type { Parcela } from '../models/Parcela';

export const parcelasMock: Parcela[] = [
  { id: 1, predioId: 1, codigo: 'SJ-01', areaHa: 30, estado: 'DISPONIBLE' },
  { id: 2, predioId: 1, codigo: 'SJ-02', areaHa: 45.5, estado: 'DISPONIBLE' },
  { id: 3, predioId: 2, codigo: 'LP-01', areaHa: 20, estado: 'DISPONIBLE' },
];
