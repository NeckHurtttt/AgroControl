import { formatArea } from '../../../utils/area';
import type { Predio } from '../models/Predio';

interface PredioTableProps {
  predios: Predio[];
}

export default function PredioTable({ predios }: PredioTableProps) {
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
            </tr>
          </thead>
          <tbody>
            {predios.map((predio) => (
              <tr key={predio.id}>
                <td>{predio.id}</td>
                <td>{predio.nombre}</td>
                <td>{predio.ubicacion ?? 'Sin ubicación'}</td>
                <td>{formatArea(predio.areaHa)}</td>
                <td>
                  <span className={`status-badge ${predio.activo ? 'status-active' : 'status-inactive'}`}>
                    {predio.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
