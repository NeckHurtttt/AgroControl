import { useState, type FormEvent } from 'react';
import { ApiError } from '../../../api/apiClient';
import { formatFecha } from '../../../utils/formato';
import type { Campana } from '../../campanas/models/Campana';
import { etiquetaCampana, etiquetaParcela, type Catalogos } from '../../campanas/utils/etiquetas';
import type { Labor } from '../../labores/models/Labor';
import type { Usuario } from '../../usuarios/models/Usuario';
import type { Incidencia } from '../models/Incidencia';
import { incidenciaService } from '../services/incidenciaService';

interface IncidenciaFormProps {
  campanas: Campana[];
  labores: Labor[];
  catalogos: Catalogos;
  usuarios: Usuario[];
  onCreated: (incidencia: Incidencia) => void;
}

type Errores = Partial<Record<'parcelaId' | 'descripcion' | 'usuarioId', string>>;

// Parcela, campaña y labor se eligen en cascada: cada lista se filtra por la anterior,
// así el backend nunca recibe una combinación que no coincide.
export default function IncidenciaForm({ campanas, labores, catalogos, usuarios, onCreated }: IncidenciaFormProps) {
  const [parcelaId, setParcelaId] = useState('');
  const [campanaId, setCampanaId] = useState('');
  const [laborId, setLaborId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [errors, setErrors] = useState<Errores>({});
  const [mensaje, setMensaje] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const campanasDeParcela = campanas.filter((campana) => campana.parcelaId === Number(parcelaId));
  const laboresDeCampana = labores.filter((labor) => labor.campanaId === Number(campanaId));

  const cambiarParcela = (valor: string) => {
    setParcelaId(valor);
    setCampanaId('');
    setLaborId('');
  };

  const cambiarCampana = (valor: string) => {
    setCampanaId(valor);
    setLaborId('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');
    setApiError('');
    const errores: Errores = {};
    if (!parcelaId) errores.parcelaId = 'Debe seleccionar la parcela afectada.';
    if (!descripcion.trim()) errores.descripcion = 'Describa lo ocurrido.';
    else if (descripcion.trim().length > 1000) errores.descripcion = 'Use como máximo 1000 caracteres.';
    if (!usuarioId) errores.usuarioId = 'Debe indicar quién reporta la incidencia.';
    setErrors(errores);
    if (Object.keys(errores).length > 0) return;

    try {
      setSubmitting(true);
      const creada = await incidenciaService.registrar({
        parcelaId: Number(parcelaId),
        campanaId: campanaId ? Number(campanaId) : null,
        laborId: laborId ? Number(laborId) : null,
        descripcion: descripcion.trim(),
        usuarioId: Number(usuarioId),
      });
      onCreated(creada);
      setDescripcion('');
      setMensaje('Incidencia registrada correctamente.');
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.campos);
      setApiError(err instanceof Error ? err.message : 'No se pudo registrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Parcela
          <select value={parcelaId} onChange={(e) => cambiarParcela(e.target.value)}>
            <option value="">Seleccione una parcela</option>
            {catalogos.parcelas.map((parcela) => (
              <option key={parcela.id} value={parcela.id}>{etiquetaParcela(parcela.id, catalogos)}</option>
            ))}
          </select>
          {errors.parcelaId && <small className="field-error">{errors.parcelaId}</small>}
        </label>
        <label>
          Campaña (opcional)
          <select value={campanaId} onChange={(e) => cambiarCampana(e.target.value)} disabled={!parcelaId}>
            <option value="">Sin campaña</option>
            {campanasDeParcela.map((campana) => (
              <option key={campana.id} value={campana.id}>{etiquetaCampana(campana, catalogos)}</option>
            ))}
          </select>
        </label>
        <label>
          Labor (opcional)
          <select value={laborId} onChange={(e) => setLaborId(e.target.value)} disabled={!campanaId}>
            <option value="">Sin labor</option>
            {laboresDeCampana.map((labor) => (
              <option key={labor.id} value={labor.id}>{labor.tipo} · {formatFecha(labor.fechaPlan)}</option>
            ))}
          </select>
        </label>
        <label>
          Reportado por
          <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
            <option value="">Seleccione un usuario</option>
            {usuarios.filter((u) => u.estado === 'ACTIVO').map((usuario) => (
              <option key={usuario.id} value={usuario.id}>{usuario.nombreCompleto}</option>
            ))}
          </select>
          {errors.usuarioId && <small className="field-error">{errors.usuarioId}</small>}
        </label>
        <label className="form-span-2">
          Descripción
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={1000} />
          {errors.descripcion && <small className="field-error">{errors.descripcion}</small>}
        </label>
      </div>
      {mensaje && <div className="form-success">{mensaje}</div>}
      {apiError && <div className="form-error">{apiError}</div>}
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Registrar incidencia'}
        </button>
      </div>
    </form>
  );
}
