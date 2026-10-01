import type { Predio } from '../models/Predio';

// Coincide con PredioRequest del backend (POST y PUT): el modelo sin id.
export type PredioRequest = Omit<Predio, 'id'>;
