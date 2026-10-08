import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/StatusBadge';
import { formatArea } from '../../../utils/area';
import type { Predio } from '../models/Predio';

interface PredioTableProps {
  predios: Predio[];
  onEditar: (predio: Predio) => void;
  onEliminar: (predio: Predio) => void;
  deletingId?: number | null;
}

export default function PredioTable({ predios, onEditar, onEliminar, deletingId = null }: PredioTableProps) {
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
                <td><StatusBadge estado={predio.activo ? 'ACTIVO' : 'INACTIVO'} /></td>
                <td>
                  <div className="table-actions">
                    <Button variant="secondary" size="sm" onClick={() => onEditar(predio)}>Editar</Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onEliminar(predio)}
                      loading={deletingId === predio.id}
                      loadingText="Eliminando..."
                    >
                      Eliminar
                    </Button>
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
