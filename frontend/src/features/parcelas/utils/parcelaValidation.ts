import { validarArea } from '../../../utils/area';
import type { ParcelaFormData } from '../types/ParcelaFormData';

export type ParcelaFormErrors = Partial<Record<keyof ParcelaFormData, string>>;

export function validarParcela(data: ParcelaFormData): ParcelaFormErrors {
  const errors: ParcelaFormErrors = {};

  if (!data.codigo.trim()) {
    errors.codigo = 'El codigo es obligatorio.';
  } else if (data.codigo.trim().length > 30) {
    errors.codigo = 'El codigo admite como maximo 30 caracteres.';
  }

  if (!data.predioId) errors.predioId = 'Debe seleccionar un predio.';

  const errorArea = validarArea(data.areaHa);
  if (errorArea) errors.areaHa = errorArea;

  return errors;
}
