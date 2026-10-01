import { useEffect, useState } from 'react';
import { formatArea } from '../../../utils/area';
import type { Predio } from '../../predios/models/Predio';
import { predioService } from '../../predios/services/predioService';
import ParcelaForm from '../components/ParcelaForm';
import ParcelaTable from '../components/ParcelaTable';
import type { Parcela } from '../models/Parcela';
import { parcelaService } from '../services/parcelaService';

export default function ParcelasPage() {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError('');
        // Predios se necesitan para mostrar a qué fundo pertenece cada parcela y llenar el select.
        const [parcelasData, prediosData] = await Promise.all([
          parcelaService.listar(controller.signal),
          predioService.listar(controller.signal),
        ]);
        setParcelas(parcelasData);
        setPredios(prediosData);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void cargarDatos();
    return () => controller.abort();
  }, []);

  const total = parcelas.length;
  const disponibles = parcelas.filter((parcela) => parcela.estado === 'DISPONIBLE').length;
  const areaTotal = parcelas.reduce((suma, parcela) => suma + (parcela.areaHa ?? 0), 0);

  return (
    <section className="feature-page">
      <div className="page-heading page-heading--actions">
        <div>
          <p className="eyebrow">GESTIÓN DE PARCELAS</p>
          <h1>Parcelas</h1>
          <p>Parcelas asociadas a cada predio mediante predioId.</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setMostrarFormulario((prev) => !prev)}
        >
          {mostrarFormulario ? 'Cerrar formulario' : '+ Nueva parcela'}
        </button>
      </div>

      {mostrarFormulario && (
        <ParcelaForm
          predios={predios}
          onCreated={(nueva) => {
            setParcelas((prev) => [...prev, nueva]);
          }}
        />
      )}

      {loading && <div className="state-card">Cargando parcelas...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && (
        <>
          <div className="stats-grid">
            <article className="stat-card"><span>Total</span><strong>{total}</strong></article>
            <article className="stat-card"><span>Disponibles</span><strong>{disponibles}</strong></article>
            <article className="stat-card"><span>Área total</span><strong>{formatArea(areaTotal)}</strong></article>
          </div>
          <ParcelaTable parcelas={parcelas} predios={predios} />
        </>
      )}
    </section>
  );
}
