import { validarArea } from '../../../utils/area';
import type { PredioFormData } from '../types/PredioFormData';

export type PredioFormErrors = Partial<Record<keyof PredioFormData, string>>;

export function validarPredio(data: PredioFormData): PredioFormErrors {
  const errors: PredioFormErrors = {};

  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (data.nombre.trim().length > 100) {
    errors.nombre = 'El nombre admite como maximo 100 caracteres.';
  }

  if (data.ubicacion.trim().length > 200) {
    errors.ubicacion = 'La ubicacion admite como maximo 200 caracteres.';
  }

  const errorArea = validarArea(data.areaHa);
  if (errorArea) errors.areaHa = errorArea;

  return errors;
}
