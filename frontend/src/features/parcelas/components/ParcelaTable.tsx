import EstadoBadge from '../../../components/common/EstadoBadge';
import { formatArea } from '../../../utils/area';
import type { Predio } from '../../predios/models/Predio';
import type { Parcela } from '../models/Parcela';

interface ParcelaTableProps {
  parcelas: Parcela[];
  predios: Predio[];
  onEditar: (parcela: Parcela) => void;
  onEliminar: (parcela: Parcela) => void;
}

export default function ParcelaTable({ parcelas, predios, onEditar, onEliminar }: ParcelaTableProps) {
  const obtenerNombrePredio = (predioId: number) => {
    const predio = predios.find((item) => item.id === predioId);
    return predio ? predio.nombre : 'Sin predio asociado';
  };

  if (parcelas.length === 0) {
    return <div className="empty-state">No hay parcelas registradas.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Predio</th>
              <th>Área</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parcelas.map((parcela) => (
              <tr key={parcela.id}>
                <td className="code-cell">{parcela.codigo}</td>
                <td>{obtenerNombrePredio(parcela.predioId)}</td>
                <td>{formatArea(parcela.areaHa)}</td>
                <td><EstadoBadge estado={parcela.estado} /></td>
                <td>
                  <div className="table-actions">
                    <button type="button" className="btn-link" onClick={() => onEditar(parcela)}>Editar</button>
                    <button type="button" className="btn-link btn-link--danger" onClick={() => onEliminar(parcela)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
