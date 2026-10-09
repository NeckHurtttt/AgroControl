import StatusBadge from '../../../components/ui/StatusBadge';
import { formatFecha } from '../../../utils/formato';
import type { Campana } from '../../campanas/models/Campana';
import { etiquetaCampana, type Catalogos } from '../../campanas/utils/etiquetas';
import type { Labor } from '../models/Labor';

interface LaborTableProps {
  labores: Labor[];
  campanas: Campana[];
  catalogos: Catalogos;
  onEjecutar: (labor: Labor) => void;
  onInsumos: (labor: Labor) => void;
}

export default function LaborTable({ labores, campanas, catalogos, onEjecutar, onInsumos }: LaborTableProps) {
  const campana = (id: number) => campanas.find((item) => item.id === id);

  if (labores.length === 0) {
    return <div className="empty-state">No hay labores para mostrar.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Labor</th>
              <th>Campaña</th>
              <th>Planificada</th>
              <th>Ejecutada</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {labores.map((labor) => {
              const campanaLabor = campana(labor.campanaId);
              return (
                <tr key={labor.id}>
                  <td className="code-cell">{labor.tipo.replace(/_/g, ' ')}</td>
                  <td>{campanaLabor ? etiquetaCampana(campanaLabor, catalogos) : `Campaña ${labor.campanaId}`}</td>
                  <td>{formatFecha(labor.fechaPlan)}</td>
                  <td>{formatFecha(labor.fechaEjecucion)}</td>
                  <td><StatusBadge estado={labor.estado} /></td>
                  <td>
                    <div className="table-actions">
                      {labor.estado === 'PLANIFICADA' && (
                        <button type="button" className="btn-link" onClick={() => onEjecutar(labor)}>Ejecutar</button>
                      )}
                      <button type="button" className="btn-link" onClick={() => onInsumos(labor)}>Insumos</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
