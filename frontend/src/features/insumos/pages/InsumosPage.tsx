import { useState } from 'react';
import PageHeading from '../../../components/common/PageHeading';
import StatsGrid from '../../../components/common/StatsGrid';
import { useCarga } from '../../../hooks/useCarga';
import { formatCantidad } from '../../../utils/formato';
import type { Usuario } from '../../usuarios/models/Usuario';
import { usuarioService } from '../../usuarios/services/usuarioService';
import InsumoForm from '../components/InsumoForm';
import MovimientosPanel from '../components/MovimientosPanel';
import type { Insumo } from '../models/Insumo';
import { insumoService } from '../services/insumoService';

const cargarDatos = async (signal: AbortSignal) => {
  const [insumos, usuarios] = await Promise.all([insumoService.listar(signal), usuarioService.listar(signal)]);
  return { insumos, usuarios };
};

export default function InsumosPage() {
  const { datos, setDatos, loading, error, recargar } = useCarga(cargarDatos, {
    insumos: [] as Insumo[],
    usuarios: [] as Usuario[],
  });
  const { insumos, usuarios } = datos;
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);

  // Se busca por id para que el panel muestre el stock actualizado después de recargar.
  const seleccionado = insumos.find((insumo) => insumo.id === seleccionadoId) ?? null;
  const sinStock = insumos.filter((insumo) => insumo.stockActual <= 0).length;

  return (
    <section className="feature-page">
      <PageHeading
        eyebrow="INVENTARIO"
        titulo="Insumos"
        descripcion="Semillas, fertilizantes y agroquímicos. El stock solo cambia mediante movimientos trazados."
        accion={
          <button type="button" className="btn-primary" onClick={() => setMostrarFormulario((prev) => !prev)}>
            {mostrarFormulario ? 'Cerrar formulario' : '+ Nuevo insumo'}
          </button>
        }
      />

      {mostrarFormulario && (
        <InsumoForm onCreated={(nuevo) => setDatos((prev) => ({ ...prev, insumos: [...prev.insumos, nuevo] }))} />
      )}

      {seleccionado && (
        <MovimientosPanel
          insumo={seleccionado}
          usuarios={usuarios}
          onMovimientoRegistrado={recargar}
          onCerrar={() => setSeleccionadoId(null)}
        />
      )}

      {loading && <div className="state-card">Cargando insumos...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && (
        <>
          <StatsGrid
            stats={[
              { etiqueta: 'Insumos', valor: insumos.length },
              { etiqueta: 'Con stock', valor: insumos.length - sinStock },
              { etiqueta: 'Sin stock', valor: sinStock },
            ]}
          />
          {insumos.length === 0 ? (
            <div className="empty-state">No hay insumos registrados.</div>
          ) : (
            <div className="table-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr><th>Insumo</th><th>Unidad</th><th>Stock actual</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {insumos.map((insumo) => (
                      <tr key={insumo.id}>
                        <td>{insumo.nombre}</td>
                        <td>{insumo.unidadMedida}</td>
                        <td className={insumo.stockActual <= 0 ? 'field-error' : ''}>
                          {formatCantidad(insumo.stockActual, insumo.unidadMedida)}
                        </td>
                        <td>
                          <button type="button" className="btn-link" onClick={() => setSeleccionadoId(insumo.id)}>
                            Movimientos
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
