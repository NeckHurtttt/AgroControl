import { useState } from 'react';
import FechaAccionPanel from '../../../components/common/FechaAccionPanel';
import PageHeading from '../../../components/common/PageHeading';
import StatsGrid from '../../../components/common/StatsGrid';
import { useCarga } from '../../../hooks/useCarga';
import type { Campana } from '../../campanas/models/Campana';
import { campanaService } from '../../campanas/services/campanaService';
import { etiquetaCampana } from '../../campanas/utils/etiquetas';
import { cultivoService } from '../../cultivos/services/cultivoService';
import type { Insumo } from '../../insumos/models/Insumo';
import { insumoService } from '../../insumos/services/insumoService';
import { parcelaService } from '../../parcelas/services/parcelaService';
import { predioService } from '../../predios/services/predioService';
import type { Usuario } from '../../usuarios/models/Usuario';
import { usuarioService } from '../../usuarios/services/usuarioService';
import ConsumosPanel from '../components/ConsumosPanel';
import LaborForm from '../components/LaborForm';
import LaborTable from '../components/LaborTable';
import type { Labor } from '../models/Labor';
import { laborService } from '../services/laborService';

const cargarDatos = async (signal: AbortSignal) => {
  const [labores, campanas, predios, parcelas, cultivos, insumos, usuarios] = await Promise.all([
    laborService.listar(signal),
    campanaService.listar(signal),
    predioService.listar(signal),
    parcelaService.listar(signal),
    cultivoService.listar(signal),
    insumoService.listar(signal),
    usuarioService.listar(signal),
  ]);
  return { labores, campanas, insumos, usuarios, catalogos: { predios, parcelas, cultivos } };
};

export default function LaboresPage() {
  const { datos, setDatos, loading, error, recargar } = useCarga(cargarDatos, {
    labores: [] as Labor[],
    campanas: [] as Campana[],
    insumos: [] as Insumo[],
    usuarios: [] as Usuario[],
    catalogos: { predios: [], parcelas: [], cultivos: [] },
  });
  const { labores, campanas, insumos, usuarios, catalogos } = datos;
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroCampana, setFiltroCampana] = useState('');
  const [ejecutando, setEjecutando] = useState<Labor | null>(null);
  const [conInsumos, setConInsumos] = useState<Labor | null>(null);

  const visibles = filtroCampana ? labores.filter((labor) => labor.campanaId === Number(filtroCampana)) : labores;
  const pendientes = visibles.filter((labor) => labor.estado === 'PLANIFICADA').length;

  return (
    <section className="feature-page">
      <PageHeading
        eyebrow="TRABAJO DE CAMPO"
        titulo="Labores"
        descripcion="Tareas planificadas y ejecutadas en cada campaña, con los insumos que consumieron."
        accion={
          <button type="button" className="btn-primary" onClick={() => setMostrarFormulario((prev) => !prev)}>
            {mostrarFormulario ? 'Cerrar formulario' : '+ Nueva labor'}
          </button>
        }
      />

      {mostrarFormulario && (
        <LaborForm
          campanas={campanas}
          catalogos={catalogos}
          onCreated={(nueva) => setDatos((prev) => ({ ...prev, labores: [nueva, ...prev.labores] }))}
        />
      )}

      {ejecutando && (
        <FechaAccionPanel
          key={ejecutando.id}
          titulo={`Ejecutar ${ejecutando.tipo.replace(/_/g, ' ').toLowerCase()} (labor #${ejecutando.id})`}
          etiqueta="Fecha de ejecución"
          textoBoton="Marcar como ejecutada"
          onCancelar={() => setEjecutando(null)}
          onConfirmar={async (fecha) => {
            const actualizada = await laborService.ejecutar(ejecutando.id, fecha);
            setDatos((prev) => ({
              ...prev,
              labores: prev.labores.map((item) => (item.id === actualizada.id ? actualizada : item)),
            }));
            setEjecutando(null);
          }}
        />
      )}

      {conInsumos && (
        <ConsumosPanel
          labor={conInsumos}
          insumos={insumos}
          usuarios={usuarios}
          onConsumoRegistrado={recargar}
          onCerrar={() => setConInsumos(null)}
        />
      )}

      {loading && <div className="state-card">Cargando labores...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && (
        <>
          <StatsGrid
            stats={[
              { etiqueta: 'Labores', valor: visibles.length },
              { etiqueta: 'Pendientes', valor: pendientes },
              { etiqueta: 'Ejecutadas', valor: visibles.length - pendientes },
            ]}
          />
          <div className="toolbar">
            <label htmlFor="filtro-campana" className="muted">Campaña:</label>
            <select id="filtro-campana" value={filtroCampana} onChange={(e) => setFiltroCampana(e.target.value)}>
              <option value="">Todas</option>
              {campanas.map((campana) => (
                <option key={campana.id} value={campana.id}>{etiquetaCampana(campana, catalogos)}</option>
              ))}
            </select>
          </div>
          <LaborTable
            labores={visibles}
            campanas={campanas}
            catalogos={catalogos}
            onEjecutar={(labor) => {
              setConInsumos(null);
              setEjecutando(labor);
            }}
            onInsumos={(labor) => {
              setEjecutando(null);
              setConInsumos(labor);
            }}
          />
        </>
      )}
    </section>
  );
}
