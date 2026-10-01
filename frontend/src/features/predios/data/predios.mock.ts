import type { Predio } from '../models/Predio';

export const prediosMock: Predio[] = [
  { id: 1, nombre: 'Fundo San José', ubicacion: 'Montero, Santa Cruz', areaHa: 120, activo: true },
  { id: 2, nombre: 'Fundo Las Palmeras', ubicacion: 'Warnes, Santa Cruz', areaHa: 85.5, activo: true },
  { id: 3, nombre: 'Predio El Retiro', ubicacion: null, areaHa: 40, activo: false },
];
