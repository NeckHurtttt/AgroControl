import { Link } from 'react-router';
import StatsGrid from '../components/common/StatsGrid';
import { campanaService } from '../features/campanas/services/campanaService';
import { etiquetaCampana } from '../features/campanas/utils/etiquetas';
import { cultivoService } from '../features/cultivos/services/cultivoService';
import { insumoService } from '../features/insumos/services/insumoService';
import { laborService } from '../features/labores/services/laborService';
import { parcelaService } from '../features/parcelas/services/parcelaService';
import { predioService } from '../features/predios/services/predioService';
import { useCarga } from '../hooks/useCarga';
import { formatArea } from '../utils/area';
import { formatCantidad, formatFecha } from '../utils/formato';

const cargarResumen = async (signal: AbortSignal) => {
  const [predios, parcelas, cultivos, campanas, labores, insumos] = await Promise.all([
    predioService.listar(signal),
    parcelaService.listar(signal),
    cultivoService.listar(signal),
    campanaService.listar(signal),
    laborService.listar(signal),
    insumoService.listar(signal),
  ]);
  return { predios, parcelas, cultivos, campanas, labores, insumos };
};

const vacio = { predios: [], parcelas: [], cultivos: [], campanas: [], labores: [], insumos: [] };

export default function DashboardPage() {
  const { datos, loading, error } = useCarga(cargarResumen, vacio);
  const { predios, parcelas, cultivos, campanas, labores, insumos } = datos;
  const catalogos = { predios, parcelas, cultivos };

  const areaTotal = parcelas.reduce((suma, parcela) => suma + (parcela.areaHa ?? 0), 0);
  const campanasAbiertas = campanas.filter((campana) => campana.estado !== 'FINALIZADA');
  const proximasLabores = labores
    .filter((labor) => labor.estado === 'PLANIFICADA')
    .sort((a, b) => a.fechaPlan.localeCompare(b.fechaPlan))
    .slice(0, 5);
  const stockBajo = [...insumos].sort((a, b) => a.stockActual - b.stockActual).slice(0, 5);
  const campana = (id: number) => campanas.find((item) => item.id === id);

  return (
    <section className="feature-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PANEL PRINCIPAL</p>
          <h1>Bienvenido a AgroControl</h1>
          <p>Resumen de la operación agrícola con datos en vivo del backend.</p>
        </div>
      </div>

      {loading && <div className="state-card">Cargando resumen...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && (
        <>
          <StatsGrid
            stats={[
              { etiqueta: 'Predios activos', valor: predios.filter((predio) => predio.activo).length },
              { etiqueta: `Parcelas (${formatArea(areaTotal)})`, valor: parcelas.length },
              { etiqueta: 'Campañas abiertas', valor: campanasAbiertas.length },
            ]}
          />
          <div className="dashboard-grid">
            <article className="list-card">
              <h3>Próximas labores</h3>
              {proximasLabores.length === 0 ? (
                <p className="muted">No hay labores pendientes.</p>
              ) : (
                <ul>
                  {proximasLabores.map((labor) => {
                    const campanaLabor = campana(labor.campanaId);
                    return (
                      <li key={labor.id}>
                        <span>
                          <strong>{labor.tipo.replace(/_/g, ' ')}</strong>
                          <br />
                          <small className="muted">
                            {campanaLabor ? etiquetaCampana(campanaLabor, catalogos) : `Campaña ${labor.campanaId}`}
                          </small>
                        </span>
                        <span>{formatFecha(labor.fechaPlan)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link className="button-link" to="/labores">Ver labores</Link>
            </article>
            <article className="list-card">
              <h3>Insumos con menos stock</h3>
              {stockBajo.length === 0 ? (
                <p className="muted">No hay insumos registrados.</p>
              ) : (
                <ul>
                  {stockBajo.map((insumo) => (
                    <li key={insumo.id}>
                      <span>{insumo.nombre}</span>
                      <strong className={insumo.stockActual <= 0 ? 'field-error' : ''}>
                        {formatCantidad(insumo.stockActual, insumo.unidadMedida)}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
              <Link className="button-link" to="/insumos">Ver inventario</Link>
            </article>
          </div>
        </>
      )}
    </section>
  );
}
