import { useEffect, useRef, useState } from 'react';
import PageHeading from '../../../components/common/PageHeading';
import StatsGrid from '../../../components/common/StatsGrid';
import { useMensajeExito } from '../../../hooks/useMensajeExito';
import { isAbortError } from '../../../shared/utils/isAbortError';
import PredioForm from '../components/PredioForm';
import PredioTable from '../components/PredioTable';
import { usePredios } from '../hooks/usePredios';
import type { Predio } from '../models/Predio';
import { predioService } from '../services/predioService';

export default function PrediosPage() {
  const { predios, setPredios, loading, error } = usePredios();
  const { successMessage, mostrarExito } = useMensajeExito();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Predio | null>(null);
  const [accionError, setAccionError] = useState('');
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const detalleRef = useRef<AbortController | null>(null);

  // Si la página se desmonta con un GET de detalle en vuelo, se cancela.
  useEffect(() => () => detalleRef.current?.abort(), []);

  const total = predios.length;
  const activos = predios.filter((predio) => predio.activo).length;

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(null);
  };

  // Editar parte de los datos frescos del backend (GET /predios/{id}); si ya no existe, no se abre el formulario.
  const editar = async (predio: Predio) => {
    detalleRef.current?.abort();
    const controller = new AbortController();
    detalleRef.current = controller;
    try {
      setAccionError('');
      setCargandoDetalle(true);
      const detalle = await predioService.obtenerPorId(predio.id, controller.signal);
      setEditando(detalle);
      setMostrarFormulario(true);
    } catch (err) {
      if (isAbortError(err)) return;
      setAccionError(err instanceof Error ? err.message : 'No se pudo cargar el predio');
    } finally {
      if (!controller.signal.aborted) setCargandoDetalle(false);
    }
  };

  const eliminar = async (predio: Predio) => {
    if (deletingId !== null) return;
    if (!window.confirm(`¿Eliminar el predio "${predio.nombre}"?`)) return;
    try {
      setAccionError('');
      setDeletingId(predio.id);
      await predioService.eliminar(predio.id);
      setPredios((prev) => prev.filter((item) => item.id !== predio.id));
      mostrarExito(`Predio "${predio.nombre}" eliminado.`);
    } catch (err) {
      setAccionError(err instanceof Error ? err.message : 'No se pudo eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="feature-page">
      <PageHeading
        eyebrow="GESTIÓN DE PREDIOS"
        titulo="Predios"
        descripcion="Fundos y terrenos registrados en la API REST de AgroControl."
        accion={
          <button
            type="button"
            className="btn-primary"
            onClick={() => (mostrarFormulario ? cerrarFormulario() : setMostrarFormulario(true))}
          >
            {mostrarFormulario ? 'Cerrar formulario' : '+ Nuevo predio'}
          </button>
        }
      />

      {mostrarFormulario && (
        <PredioForm
          key={editando?.id ?? 'nuevo'}
          predio={editando}
          onCancel={cerrarFormulario}
          onSaved={(guardado) => {
            setPredios((prev) =>
              editando ? prev.map((item) => (item.id === guardado.id ? guardado : item)) : [...prev, guardado],
            );
            mostrarExito(editando ? 'Predio actualizado correctamente.' : 'Predio creado correctamente.');
            if (editando) cerrarFormulario();
          }}
        />
      )}

      {cargandoDetalle && <div className="state-card">Cargando detalle...</div>}
      {successMessage && <div className="form-success" role="status">{successMessage}</div>}
      {accionError && <div className="form-error">{accionError}</div>}
      {loading && <div className="state-card">Cargando predios...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && (
        <>
          <StatsGrid
            stats={[
              { etiqueta: 'Total', valor: total },
              { etiqueta: 'Activos', valor: activos },
              { etiqueta: 'Inactivos', valor: total - activos },
            ]}
          />
          <PredioTable
            predios={predios}
            onEditar={editar}
            onEliminar={eliminar}
            deletingId={deletingId}
          />
        </>
      )}
    </section>
  );
}
