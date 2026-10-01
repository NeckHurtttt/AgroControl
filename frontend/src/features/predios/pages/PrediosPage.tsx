import { useState } from 'react';
import PageHeading from '../../../components/common/PageHeading';
import StatsGrid from '../../../components/common/StatsGrid';
import { useCarga } from '../../../hooks/useCarga';
import PredioForm from '../components/PredioForm';
import PredioTable from '../components/PredioTable';
import type { Predio } from '../models/Predio';
import { predioService } from '../services/predioService';

const cargarPredios = (signal: AbortSignal) => predioService.listar(signal);

export default function PrediosPage() {
  const { datos: predios, setDatos: setPredios, loading, error } = useCarga<Predio[]>(cargarPredios, []);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Predio | null>(null);
  const [accionError, setAccionError] = useState('');

  const total = predios.length;
  const activos = predios.filter((predio) => predio.activo).length;

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(null);
  };

  const eliminar = async (predio: Predio) => {
    if (!window.confirm(`¿Eliminar el predio "${predio.nombre}"?`)) return;
    try {
      setAccionError('');
      await predioService.eliminar(predio.id);
      setPredios((prev) => prev.filter((item) => item.id !== predio.id));
    } catch (err) {
      setAccionError(err instanceof Error ? err.message : 'No se pudo eliminar');
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
            if (editando) cerrarFormulario();
          }}
        />
      )}

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
            onEditar={(predio) => {
              setEditando(predio);
              setMostrarFormulario(true);
            }}
            onEliminar={eliminar}
          />
        </>
      )}
    </section>
  );
}
