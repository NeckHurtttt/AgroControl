import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError } from '../../../api/apiClient';
import { parseArea } from '../../../utils/area';
import type { Predio } from '../models/Predio';
import { predioService } from '../services/predioService';
import type { PredioFormData } from '../types/PredioFormData';
import type { PredioRequest } from '../types/PredioRequest';
import { validarPredio, type PredioFormErrors } from '../utils/predioValidation';

const initialPredioForm: PredioFormData = {
  nombre: '',
  ubicacion: '',
  areaHa: '',
  activo: true,
};

function desdePredio(predio: Predio): PredioFormData {
  return {
    nombre: predio.nombre,
    ubicacion: predio.ubicacion ?? '',
    areaHa: predio.areaHa === null ? '' : String(predio.areaHa),
    activo: predio.activo,
  };
}

interface PredioFormProps {
  predio?: Predio | null;
  onSaved?: (predio: Predio) => void;
  onCancel?: () => void;
}

export default function PredioForm({ predio, onSaved, onCancel }: PredioFormProps) {
  const editando = Boolean(predio);
  const [formData, setFormData] = useState<PredioFormData>(predio ? desdePredio(predio) : initialPredioForm);
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

    const payload: PredioRequest = {
      nombre: formData.nombre.trim(),
      ubicacion: formData.ubicacion.trim() || null,
      areaHa: parseArea(formData.areaHa),
      activo: formData.activo,
    };

    try {
      setSubmitting(true);
      const guardado = predio
        ? await predioService.actualizar(predio.id, payload)
        : await predioService.crear(payload);
      onSaved?.(guardado);
      if (!predio) {
        setFormData(initialPredioForm);
        setMensaje('Predio creado correctamente.');
      }
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.campos);
      setApiError(err instanceof Error ? err.message : 'No se pudo guardar');
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
      {editando && <h3 className="panel-title">Editar predio #{predio?.id}</h3>}
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
        {editando ? (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
        ) : (
          <button type="button" className="btn-secondary" onClick={limpiar} disabled={submitting}>
            Limpiar
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : editando ? 'Guardar cambios' : 'Guardar predio'}
        </button>
      </div>
    </form>
  );
}
