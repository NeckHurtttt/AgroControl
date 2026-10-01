import type { Predio } from '../models/Predio';

// Coincide con PredioRequest del backend: el modelo sin id.
export type PredioCreateRequest = Omit<Predio, 'id'>;
