import type { Parcela } from '../models/Parcela';

// Coincide con ParcelaRequest del backend: no envía id ni estado (el backend asigna DISPONIBLE).
export type ParcelaCreateRequest = Omit<Parcela, 'id' | 'estado'>;
