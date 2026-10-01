import type { Parcela } from '../models/Parcela';

// Coincide con ActualizarParcelaRequest: el predio no se cambia al editar.
export type ParcelaUpdateRequest = Pick<Parcela, 'codigo' | 'areaHa' | 'estado'>;
