import { Link, useParams } from 'react-router';
import PageHeading from '../../../components/common/PageHeading';
import StatsGrid from '../../../components/common/StatsGrid';
import Barras from '../../../components/ui/Barras';
import EmptyState from '../../../components/ui/EmptyState';
import ExportarBotones from '../../../components/ui/ExportarBotones';
import StatusBadge from '../../../components/ui/StatusBadge';
import { useCarga } from '../../../hooks/useCarga';
import { campanaAbierta, incidenciaAbierta } from '../../../shared/utils/estados';
import { formatArea } from '../../../utils/area';
import { formatCantidad } from '../../../utils/formato';
import { campanaService } from '../../campanas/services/campanaService';
import { nombreCultivo, type Catalogos } from '../../campanas/utils/etiquetas';
import { resumenPor, superficie } from '../../campanas/utils/rendimiento';
import { cosechaService } from '../../cosechas/services/cosechaService';
import { cultivoService } from '../../cultivos/services/cultivoService';
import { incidenciaService } from '../../incidencias/services/incidenciaService';
import { parcelaService } from '../../parcelas/services/parcelaService';
import { predioService } from '../services/predioService';

const cargar = async (signal: AbortSignal) => {
  const [campanas, predios, parcelas, cultivos, cosechas, incidencias] = await Promise.all([
    campanaService.listar(signal),
    predioService.listar(signal),
    parcelaService.listar(signal),
    cultivoService.listar(signal),
    cosechaService.listar(signal),
    incidenciaService.listar(signal),
  ]);
  return { campanas, cosechas, incidencias, catalogos: { predios, parcelas, cultivos } as Catalogos };
};

const vacio = {
  campanas: [],
  cosechas: [],
  incidencias: [],
  catalogos: { predios: [], parcelas: [], cultivos: [] } as Catalogos,
} as Awaited<ReturnType<typeof cargar>>;

// Un predio de un vistazo: sus parcelas, qué tienen sembrado y cuánto se cosechó en cada una.
export default function FichaPredioPage() {
  const id = Number(useParams().id);
  const { datos, loading, error } = useCarga(cargar, vacio, undefined, 'ficha-predio');
  const { catalogos } = datos;
  const predio = catalogos.predios.find((item) => item.id === id);

  if (loading) return <div className="state-card">Cargando ficha...</div>;
  if (error) return <div className="state-card error">{error}</div>;
  if (!predio) return <EmptyState title="No existe ese predio." />;

  const parcelas = catalogos.parcelas.filter((parcela) => parcela.predioId === id);
  const idsParcela = new Set(parcelas.map((parcela) => parcela.id));
  const campanas = datos.campanas.filter((campana) => idsParcela.has(campana.parcelaId));
  const abiertas = campanas.filter(campanaAbierta);
  // Planificada todavía no está en el campo.
  const enCurso = campanas.filter((campana) => campana.estado === 'EN_CURSO');
  const sembradoHa = enCurso.reduce((suma, campana) => suma + (superficie(campana, parcelas) ?? 0), 0);
  const incidencias = datos.incidencias.filter((i) => i.parcelaId !== null && idsParcela.has(i.parcelaId) && incidenciaAbierta(i)).length;
  const cosecha = resumenPor(campanas, datos.cosechas, parcelas, catalogos.cultivos, (campana) => campana.parcelaId);
  const sembradoEn = (parcelaId: number) => {
    const actual = enCurso.find((campana) => campana.parcelaId === parcelaId);
    return actual ? nombreCultivo(actual.cultivoId, catalogos) : 'Nada';
  };
  const codigo = (parcelaId: number) => parcelas.find((parcela) => parcela.id === parcelaId)?.codigo ?? `Parcela ${parcelaId}`;
  const toneladas = (parcelaId: number) => cosecha.find((fila) => fila.clave === parcelaId)?.toneladas ?? 0;

  return (
    <section className="feature-page">
      <PageHeading eyebrow="FICHA DE PREDIO" titulo={predio.nombre} descripcion={`${predio.ubicacion ?? 'Sin ubicación'} · ${formatArea(predio.areaHa)}`} />
      <p><Link to="/predios">← Volver a predios</Link></p>
      <StatsGrid
        stats={[
          { etiqueta: 'Parcelas', valor: parcelas.length },
          { etiqueta: 'Campañas abiertas', valor: abiertas.length },
          { etiqueta: 'Sembrado ahora', valor: formatArea(sembradoHa) },
          { etiqueta: 'Incidencias abiertas', valor: incidencias },
        ]}
      />
      {cosecha.length > 0 && (
        <article className="list-card">
          <h3>Cosecha neta por parcela, todas las campañas</h3>
          <Barras
            nombre="Cosecha neta por parcela"
            filas={cosecha.map((fila) => ({
              clave: fila.clave,
              etiqueta: <Link to={`/parcelas/${fila.clave}`}>{codigo(fila.clave)}</Link>,
              valor: fila.toneladas,
              texto: formatCantidad(fila.toneladas, 't'),
            }))}
          />
        </article>
      )}
      <div className="barra-resultados">
        <h2 className="ficha-seccion">Parcelas</h2>
        <ExportarBotones
          titulo={`Predio ${predio.nombre}`}
          filas={parcelas}
          columnas={[
            { titulo: 'Parcela', valor: (p) => p.codigo },
            { titulo: 'Área', valor: (p) => formatArea(p.areaHa) },
            { titulo: 'Sembrado ahora', valor: (p) => sembradoEn(p.id) },
            { titulo: 'Cosecha neta (t)', valor: (p) => formatCantidad(toneladas(p.id), 't') },
            { titulo: 'Estado', valor: (p) => p.estado },
          ]}
        />
      </div>
      {parcelas.length === 0 ? (
        <EmptyState title="Este predio todavía no tiene parcelas." />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Parcela</th><th>Área</th><th>Sembrado ahora</th><th>Cosecha neta</th><th>Estado</th></tr></thead>
              <tbody>
                {parcelas.map((parcela) => (
                  <tr key={parcela.id}>
                    <td><Link to={`/parcelas/${parcela.id}`}>{parcela.codigo}</Link></td>
                    <td>{formatArea(parcela.areaHa)}</td>
                    <td>{sembradoEn(parcela.id)}</td>
                    <td>{formatCantidad(toneladas(parcela.id), 't')}</td>
                    <td><StatusBadge estado={parcela.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
