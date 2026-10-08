import { useEffect, useRef, useState } from 'react';
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
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [predioFiltro, setPredioFiltro] = useState('');
  const detalleRef = useRef<AbortController | null>(null);

  // Si la página se desmonta con un GET de detalle en vuelo, se cancela.
  useEffect(() => () => detalleRef.current?.abort(), []);

  const setParcelas = (actualizar: (prev: Parcela[]) => Parcela[]) =>
    setDatos((prev) => ({ ...prev, parcelas: actualizar(prev.parcelas) }));

  // Derivado en el render: el filtro usa la lista ya cargada (GET /parcelas), sin pedir nada nuevo.
  const parcelasVisibles = predioFiltro
    ? parcelas.filter((parcela) => parcela.predioId === Number(predioFiltro))
    : parcelas;

  const total = parcelas.length;
  const disponibles = parcelas.filter((parcela) => parcela.estado === 'DISPONIBLE').length;
  const areaTotal = parcelas.reduce((suma, parcela) => suma + (parcela.areaHa ?? 0), 0);

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(null);
  };

  // Editar parte de los datos frescos del backend (GET /parcelas/{id}); si ya no existe, no se abre el formulario.
  const editar = async (parcela: Parcela) => {
    detalleRef.current?.abort();
    const controller = new AbortController();
    detalleRef.current = controller;
    try {
      setAccionError('');
      setCargandoDetalle(true);
      const detalle = await parcelaService.obtenerPorId(parcela.id, controller.signal);
      setEditando(detalle);
      setMostrarFormulario(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setAccionError(err instanceof Error ? err.message : 'No se pudo cargar la parcela');
    } finally {
      if (!controller.signal.aborted) setCargandoDetalle(false);
    }
  };

  const eliminar = async (parcela: Parcela) => {
    if (deletingId !== null) return;
    if (!window.confirm(`¿Eliminar la parcela ${parcela.codigo}?`)) return;
    try {
      setAccionError('');
      setDeletingId(parcela.id);
      await parcelaService.eliminar(parcela.id);
      setParcelas((prev) => prev.filter((item) => item.id !== parcela.id));
    } catch (err) {
      setAccionError(err instanceof Error ? err.message : 'No se pudo eliminar');
    } finally {
      setDeletingId(null);
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

      {cargandoDetalle && <div className="state-card">Cargando detalle...</div>}
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
          <div className="toolbar">
            <label className="toolbar__field">
              Filtrar por predio
              <select value={predioFiltro} onChange={(e) => setPredioFiltro(e.target.value)}>
                <option value="">Todos los predios</option>
                {predios.map((predio) => (
                  <option key={predio.id} value={predio.id}>{predio.nombre}</option>
                ))}
              </select>
            </label>
          </div>
          <ParcelaTable
            parcelas={parcelasVisibles}
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
