import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError } from '../../../api/apiClient';
import { parseArea } from '../../../utils/area';
import type { Predio } from '../../predios/models/Predio';
import type { Parcela } from '../models/Parcela';
import { parcelaService } from '../services/parcelaService';
import type { ParcelaCreateRequest } from '../types/ParcelaCreateRequest';
import type { ParcelaFormData } from '../types/ParcelaFormData';
import { validarParcela, type ParcelaFormErrors } from '../utils/parcelaValidation';

const initialParcelaForm: ParcelaFormData = {
  codigo: '',
  areaHa: '',
  predioId: '',
};

interface ParcelaFormProps {
  predios: Predio[];
  onCreated?: (parcela: Parcela) => void;
}

export default function ParcelaForm({ predios, onCreated }: ParcelaFormProps) {
  const [formData, setFormData] = useState<ParcelaFormData>(initialParcelaForm);
  const [errors, setErrors] = useState<ParcelaFormErrors>({});
  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const prediosActivos = predios.filter((predio) => predio.activo);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');
    setApiError('');

    const validationErrors = validarParcela(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload: ParcelaCreateRequest = {
      predioId: Number(formData.predioId),
      codigo: formData.codigo.trim().toUpperCase(),
      areaHa: parseArea(formData.areaHa),
    };

    try {
      setSubmitting(true);
      const creada = await parcelaService.crear(payload);
      onCreated?.(creada);
      setFormData(initialParcelaForm);
      setMensaje('Parcela creada correctamente.');
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.campos);
      setApiError(err instanceof Error ? err.message : 'No se pudo crear');
    } finally {
      setSubmitting(false);
    }
  };

  const limpiar = () => {
    setFormData(initialParcelaForm);
    setErrors({});
    setMensaje('');
    setApiError('');
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Predio
          <select name="predioId" value={formData.predioId} onChange={handleChange}>
            <option value="">Seleccione un predio</option>
            {prediosActivos.map((predio) => (
              <option key={predio.id} value={predio.id}>
                {predio.nombre}
              </option>
            ))}
          </select>
          {errors.predioId && <small className="field-error">{errors.predioId}</small>}
        </label>
        <label>
          Codigo
          <input name="codigo" value={formData.codigo} onChange={handleChange} placeholder="Ej.: SJ-03" />
          {errors.codigo && <small className="field-error">{errors.codigo}</small>}
        </label>
        <label>
          Area (ha)
          <input type="number" step="0.01" min="0" name="areaHa" value={formData.areaHa} onChange={handleChange} />
          {errors.areaHa && <small className="field-error">{errors.areaHa}</small>}
        </label>
      </div>

      {mensaje && <div className="form-success">{mensaje}</div>}
      {apiError && <div className="form-error">{apiError}</div>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={limpiar} disabled={submitting}>
          Limpiar
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar parcela'}
        </button>
      </div>
    </form>
  );
}
