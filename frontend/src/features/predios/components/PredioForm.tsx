import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError } from '../../../api/apiClient';
import { parseArea } from '../../../utils/area';
import type { Predio } from '../models/Predio';
import { predioService } from '../services/predioService';
import type { PredioCreateRequest } from '../types/PredioCreateRequest';
import type { PredioFormData } from '../types/PredioFormData';
import { validarPredio, type PredioFormErrors } from '../utils/predioValidation';

const initialPredioForm: PredioFormData = {
  nombre: '',
  ubicacion: '',
  areaHa: '',
  activo: true,
};

interface PredioFormProps {
  onCreated?: (predio: Predio) => void;
}

export default function PredioForm({ onCreated }: PredioFormProps) {
  const [formData, setFormData] = useState<PredioFormData>(initialPredioForm);
  const [errors, setErrors] = useState<PredioFormErrors>({});
  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');
    setApiError('');

    const validationErrors = validarPredio(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload: PredioCreateRequest = {
      nombre: formData.nombre.trim(),
      ubicacion: formData.ubicacion.trim() || null,
      areaHa: parseArea(formData.areaHa),
      activo: formData.activo,
    };

    try {
      setSubmitting(true);
      const creado = await predioService.crear(payload);
      onCreated?.(creado);
      setFormData(initialPredioForm);
      setMensaje('Predio creado correctamente.');
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.campos);
      setApiError(err instanceof Error ? err.message : 'No se pudo crear');
    } finally {
      setSubmitting(false);
    }
  };

  const limpiar = () => {
    setFormData(initialPredioForm);
    setErrors({});
    setMensaje('');
    setApiError('');
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Nombre
          <input name="nombre" value={formData.nombre} onChange={handleChange} />
          {errors.nombre && <small className="field-error">{errors.nombre}</small>}
        </label>
        <label>
          Area (ha)
          <input type="number" step="0.01" min="0" name="areaHa" value={formData.areaHa} onChange={handleChange} />
          {errors.areaHa && <small className="field-error">{errors.areaHa}</small>}
        </label>
        <label className="form-span-2">
          Ubicacion
          <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ej.: Montero, Santa Cruz" />
          {errors.ubicacion && <small className="field-error">{errors.ubicacion}</small>}
        </label>
        <label className="checkbox-field form-span-2">
          <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
          Predio activo
        </label>
      </div>

      {mensaje && <div className="form-success">{mensaje}</div>}
      {apiError && <div className="form-error">{apiError}</div>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={limpiar} disabled={submitting}>
          Limpiar
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar predio'}
        </button>
      </div>
    </form>
  );
}
