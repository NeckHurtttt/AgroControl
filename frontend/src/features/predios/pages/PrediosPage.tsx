import { useEffect, useState } from 'react';
import PredioForm from '../components/PredioForm';
import PredioTable from '../components/PredioTable';
import type { Predio } from '../models/Predio';
import { predioService } from '../services/predioService';

export default function PrediosPage() {
  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const cargarPredios = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await predioService.listar(controller.signal);
        setPredios(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void cargarPredios();
    return () => controller.abort();
  }, []);

  const total = predios.length;
  const activos = predios.filter((predio) => predio.activo).length;

  return (
    <section className="feature-page">
      <div className="page-heading page-heading--actions">
        <div>
          <p className="eyebrow">GESTIÓN DE PREDIOS</p>
          <h1>Predios</h1>
          <p>Fundos y terrenos registrados en la API REST de AgroControl.</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setMostrarFormulario((prev) => !prev)}
        >
          {mostrarFormulario ? 'Cerrar formulario' : '+ Nuevo predio'}
        </button>
      </div>

      {mostrarFormulario && (
        <PredioForm
          onCreated={(nuevo) => {
            setPredios((prev) => [...prev, nuevo]);
          }}
        />
      )}

      {loading && <div className="state-card">Cargando predios...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && (
        <>
          <div className="stats-grid">
            <article className="stat-card"><span>Total</span><strong>{total}</strong></article>
            <article className="stat-card"><span>Activos</span><strong>{activos}</strong></article>
            <article className="stat-card"><span>Inactivos</span><strong>{total - activos}</strong></article>
          </div>
          <PredioTable predios={predios} />
        </>
      )}
    </section>
  );
}
