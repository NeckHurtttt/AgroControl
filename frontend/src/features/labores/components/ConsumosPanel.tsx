import { useState, type FormEvent } from 'react';
import { useCarga } from '../../../hooks/useCarga';
import { formatCantidad, formatFecha, validarCantidadPositiva } from '../../../utils/formato';
import type { Insumo } from '../../insumos/models/Insumo';
import type { Usuario } from '../../usuarios/models/Usuario';
import type { ConsumoLabor, Labor } from '../models/Labor';
import { laborService } from '../services/laborService';

interface ConsumosPanelProps {
  labor: Labor;
  insumos: Insumo[];
  usuarios: Usuario[];
  onConsumoRegistrado: () => void;
  onCerrar: () => void;
}

export default function ConsumosPanel({ labor, insumos, usuarios, onConsumoRegistrado, onCerrar }: ConsumosPanelProps) {
  const { datos: consumos, setDatos: setConsumos, loading, error } = useCarga<ConsumoLabor[]>(
    (signal) => laborService.listarConsumos(labor.id, signal),
    [],
    labor.id,
  );
  const [insumoId, setInsumoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const insumo = (id: number) => insumos.find((item) => item.id === id);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorCantidad = validarCantidadPositiva(cantidad);
    if (!insumoId || !usuarioId || errorCantidad) {
      setErrorForm(errorCantidad ?? 'Seleccione el insumo y quién registra el consumo.');
      return;
    }
    try {
      setSubmitting(true);
      setErrorForm('');
      const nuevo = await laborService.registrarConsumo(labor.id, {
        insumoId: Number(insumoId),
        cantidad: Number(cantidad),
        usuarioId: Number(usuarioId),
      });
      setConsumos((prev) => [...prev, nuevo]);
      setCantidad('');
      onConsumoRegistrado();
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : 'No se pudo registrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="entity-form">
      <h3 className="panel-title">Insumos usados en {labor.tipo.replace(/_/g, ' ').toLowerCase()} (labor #{labor.id})</h3>

      {loading && <p className="muted">Cargando consumos...</p>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && consumos.length === 0 && <p className="muted">Todavía no se registraron insumos en esta labor.</p>}
      {consumos.length > 0 && (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr><th>Insumo</th><th>Cantidad</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {consumos.map((consumo) => (
                <tr key={consumo.id}>
                  <td>{insumo(consumo.insumoId)?.nombre ?? `Insumo ${consumo.insumoId}`}</td>
                  <td>{formatCantidad(consumo.cantidad, insumo(consumo.insumoId)?.unidadMedida ?? '')}</td>
                  <td>{formatFecha(consumo.fecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid panel-form">
          <label>
            Insumo
            <select value={insumoId} onChange={(e) => setInsumoId(e.target.value)}>
              <option value="">Seleccione un insumo</option>
              {insumos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre} (stock: {formatCantidad(item.stockActual, item.unidadMedida)})
                </option>
              ))}
            </select>
          </label>
          <label>
            Cantidad
            <input type="number" step="0.01" min="0" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </label>
          <label>
            Registrado por
            <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
              <option value="">Seleccione un usuario</option>
              {usuarios.filter((u) => u.estado === 'ACTIVO').map((usuario) => (
                <option key={usuario.id} value={usuario.id}>{usuario.nombreCompleto}</option>
              ))}
            </select>
          </label>
        </div>
        {errorForm && <div className="form-error">{errorForm}</div>}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCerrar} disabled={submitting}>Cerrar</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Registrar consumo'}
          </button>
        </div>
      </form>
    </div>
  );
}
