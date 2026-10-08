import type { Parcela } from '../models/Parcela';

// Coincide con ActualizarParcelaRequest: predioId permite mover la parcela a otro predio activo.
export type ParcelaUpdateRequest = Pick<Parcela, 'predioId' | 'codigo' | 'areaHa' | 'estado'>;
