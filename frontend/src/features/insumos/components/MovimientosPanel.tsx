import { useState, type FormEvent } from 'react';
import StatusBadge from '../../../components/ui/StatusBadge';
import { useCarga } from '../../../hooks/useCarga';
import { formatCantidad, formatFecha, validarCantidadPositiva } from '../../../utils/formato';
import type { Usuario } from '../../usuarios/models/Usuario';
import { nombreUsuario } from '../../usuarios/services/usuarioService';
import type { Insumo, MovimientoInsumo, TipoMovimiento } from '../models/Insumo';
import { insumoService } from '../services/insumoService';

interface MovimientosPanelProps {
  insumo: Insumo;
  usuarios: Usuario[];
  onMovimientoRegistrado: () => void;
  onCerrar: () => void;
}

export default function MovimientosPanel({ insumo, usuarios, onMovimientoRegistrado, onCerrar }: MovimientosPanelProps) {
  const { datos: movimientos, setDatos: setMovimientos, loading, error } = useCarga<MovimientoInsumo[]>(
    (signal) => insumoService.listarMovimientos(insumo.id, signal),
    [],
    insumo.id,
  );
  const [tipo, setTipo] = useState<TipoMovimiento>('ENTRADA');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorCantidad = validarCantidadPositiva(cantidad);
    if (!usuarioId || errorCantidad) {
      setErrorForm(errorCantidad ?? 'Seleccione quién registra el movimiento.');
      return;
    }
    try {
      setSubmitting(true);
      setErrorForm('');
      const nuevo = await insumoService.registrarMovimiento(insumo.id, {
        tipo,
        cantidad: Number(cantidad),
        motivo: motivo.trim() || null,
        usuarioId: Number(usuarioId),
      });
      setMovimientos((prev) => [nuevo, ...prev]);
      setCantidad('');
      setMotivo('');
      onMovimientoRegistrado();
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : 'No se pudo registrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="entity-form">
      <h3 className="panel-title">
        Movimientos de {insumo.nombre} · stock actual {formatCantidad(insumo.stockActual, insumo.unidadMedida)}
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            Tipo
            <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoMovimiento)}>
              <option value="ENTRADA">ENTRADA (compra, devolución)</option>
              <option value="SALIDA">SALIDA (merma, ajuste)</option>
            </select>
          </label>
          <label>
            Cantidad ({insumo.unidadMedida})
            <input type="number" step="0.01" min="0" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </label>
          <label>
            Motivo
            <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej.: Compra factura 0012" />
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
            {submitting ? 'Guardando...' : 'Registrar movimiento'}
          </button>
        </div>
      </form>

      {loading && <p className="muted">Cargando historial...</p>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && movimientos.length === 0 && <p className="muted">Este insumo todavía no tiene movimientos.</p>}
      {movimientos.length > 0 && (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr><th>Fecha</th><th>Tipo</th><th>Cantidad</th><th>Motivo</th><th>Registrado por</th></tr>
            </thead>
            <tbody>
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id}>
                  <td>{formatFecha(movimiento.fecha)}</td>
                  <td><StatusBadge estado={movimiento.tipo} /></td>
                  <td>{formatCantidad(movimiento.cantidad, insumo.unidadMedida)}</td>
                  <td>{movimiento.motivo ?? '—'}</td>
                  <td>{nombreUsuario(usuarios, movimiento.usuarioId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
