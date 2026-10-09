import { useState, type FormEvent } from 'react';
import { ApiError } from '../../../api/apiClient';
import type { Insumo } from '../models/Insumo';
import { insumoService } from '../services/insumoService';

const UNIDADES = ['kg', 'L', 't', 'unidad', 'bolsa'];

interface InsumoFormProps {
  onCreated: (insumo: Insumo) => void;
}

type Errores = Partial<Record<'nombre' | 'unidadMedida', string>>;

export default function InsumoForm({ onCreated }: InsumoFormProps) {
  const [nombre, setNombre] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('kg');
  const [errors, setErrors] = useState<Errores>({});
  const [mensaje, setMensaje] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');
    setApiError('');
    const errores: Errores = {};
    if (!nombre.trim()) errores.nombre = 'El nombre es obligatorio.';
    else if (nombre.trim().length > 100) errores.nombre = 'El nombre admite como maximo 100 caracteres.';
    if (!unidadMedida) errores.unidadMedida = 'La unidad es obligatoria.';
    setErrors(errores);
    if (Object.keys(errores).length > 0) return;

    try {
      setSubmitting(true);
      const creado = await insumoService.crear({ nombre: nombre.trim(), unidadMedida });
      onCreated(creado);
      setNombre('');
      setMensaje('Insumo creado con stock 0. Registra una ENTRADA para cargar existencias.');
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.campos);
      setApiError(err instanceof Error ? err.message : 'No se pudo crear');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej.: Urea 46%" />
          {errors.nombre && <small className="field-error">{errors.nombre}</small>}
        </label>
        <label>
          Unidad de medida
          <select value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)}>
            {UNIDADES.map((unidad) => <option key={unidad} value={unidad}>{unidad}</option>)}
          </select>
          {errors.unidadMedida && <small className="field-error">{errors.unidadMedida}</small>}
        </label>
      </div>
      {mensaje && <div className="form-success">{mensaje}</div>}
      {apiError && <div className="form-error">{apiError}</div>}
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar insumo'}
        </button>
      </div>
    </form>
  );
}
