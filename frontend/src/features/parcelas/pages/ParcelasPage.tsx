import { useState } from 'react';
import PageHeading from '../../../components/common/PageHeading';
import StatsGrid from '../../../components/common/StatsGrid';
import { useCarga } from '../../../hooks/useCarga';
import { formatArea } from '../../../utils/area';
import { predioService } from '../../predios/services/predioService';
import ParcelaForm from '../components/ParcelaForm';
import ParcelaTable from '../components/ParcelaTable';
import type { Parcela } from '../models/Parcela';
import { parcelaService } from '../services/parcelaService';

// Predios se necesitan para mostrar a qué fundo pertenece cada parcela y llenar el select.
const cargarDatos = async (signal: AbortSignal) => {
  const [parcelas, predios] = await Promise.all([
    parcelaService.listar(signal),
    predioService.listar(signal),
  ]);
  return { parcelas, predios };
};

export default function ParcelasPage() {
  const { datos, setDatos, loading, error } = useCarga(cargarDatos, { parcelas: [], predios: [] });
  const { parcelas, predios } = datos;
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Parcela | null>(null);
  const [accionError, setAccionError] = useState('');

  const setParcelas = (actualizar: (prev: Parcela[]) => Parcela[]) =>
    setDatos((prev) => ({ ...prev, parcelas: actualizar(prev.parcelas) }));

  const total = parcelas.length;
  const disponibles = parcelas.filter((parcela) => parcela.estado === 'DISPONIBLE').length;
  const areaTotal = parcelas.reduce((suma, parcela) => suma + (parcela.areaHa ?? 0), 0);

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(null);
  };

  const eliminar = async (parcela: Parcela) => {
    if (!window.confirm(`¿Eliminar la parcela ${parcela.codigo}?`)) return;
    try {
      setAccionError('');
      await parcelaService.eliminar(parcela.id);
      setParcelas((prev) => prev.filter((item) => item.id !== parcela.id));
    } catch (err) {
      setAccionError(err instanceof Error ? err.message : 'No se pudo eliminar');
    }
  };

  return (
    <section className="feature-page">
      <PageHeading
        eyebrow="GESTIÓN DE PARCELAS"
        titulo="Parcelas"
        descripcion="Parcelas asociadas a cada predio mediante predioId."
        accion={
          <button
            type="button"
            className="btn-primary"
            onClick={() => (mostrarFormulario ? cerrarFormulario() : setMostrarFormulario(true))}
          >
            {mostrarFormulario ? 'Cerrar formulario' : '+ Nueva parcela'}
          </button>
        }
      />

      {mostrarFormulario && (
        <ParcelaForm
          key={editando?.id ?? 'nueva'}
          predios={predios}
          parcela={editando}
          onCancel={cerrarFormulario}
          onSaved={(guardada) => {
            setParcelas((prev) =>
              editando ? prev.map((item) => (item.id === guardada.id ? guardada : item)) : [...prev, guardada],
            );
            if (editando) cerrarFormulario();
          }}
        />
      )}

      {accionError && <div className="form-error">{accionError}</div>}
      {loading && <div className="state-card">Cargando parcelas...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && (
        <>
          <StatsGrid
            stats={[
              { etiqueta: 'Total', valor: total },
              { etiqueta: 'Disponibles', valor: disponibles },
              { etiqueta: 'Área total', valor: formatArea(areaTotal) },
            ]}
          />
          <ParcelaTable
            parcelas={parcelas}
            predios={predios}
            onEditar={(parcela) => {
              setEditando(parcela);
              setMostrarFormulario(true);
            }}
            onEliminar={eliminar}
          />
        </>
      )}
    </section>
  );
}
