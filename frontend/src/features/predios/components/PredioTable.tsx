import EstadoBadge from '../../../components/common/EstadoBadge';
import { formatArea } from '../../../utils/area';
import type { Predio } from '../models/Predio';

interface PredioTableProps {
  predios: Predio[];
  onEditar: (predio: Predio) => void;
  onEliminar: (predio: Predio) => void;
}

export default function PredioTable({ predios, onEditar, onEliminar }: PredioTableProps) {
  if (predios.length === 0) {
    return <div className="empty-state">No hay predios registrados.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Predio</th>
              <th>Ubicación</th>
              <th>Área</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {predios.map((predio) => (
              <tr key={predio.id}>
                <td>{predio.id}</td>
                <td>{predio.nombre}</td>
                <td>{predio.ubicacion ?? 'Sin ubicación'}</td>
                <td>{formatArea(predio.areaHa)}</td>
                <td><EstadoBadge estado={predio.activo ? 'ACTIVO' : 'INACTIVO'} /></td>
                <td>
                  <div className="table-actions">
                    <button type="button" className="btn-link" onClick={() => onEditar(predio)}>Editar</button>
                    <button type="button" className="btn-link btn-link--danger" onClick={() => onEliminar(predio)}>Eliminar</button>
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
