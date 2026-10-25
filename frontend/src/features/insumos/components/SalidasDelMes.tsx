import { useCarga } from '../../../hooks/useCarga';
import { formatCantidad } from '../../../utils/formato';
import { CATEGORIAS, type SalidaDeAlmacen } from '../models/Insumo';
import CategoriaIcono from './CategoriaIcono';
import { insumoService } from '../services/insumoService';

interface SalidasDelMesProps {
  // Cambia cuando se registra un movimiento, para volver a sumar
  version: number;
}

// "¿Cuánto diésel y cuántos repuestos salieron este mes?" agrupado por categoría
export default function SalidasDelMes({ version }: SalidasDelMesProps) {
  const { datos: salidas, loading, error } = useCarga<SalidaDeAlmacen[]>(
    (signal) => insumoService.salidas(signal),
    [],
    version,
  );
  const grupos = CATEGORIAS
    .map((c) => ({ ...c, salidas: salidas.filter((s) => s.categoria === c.valor) }))
    .filter((g) => g.salidas.length > 0);

  return (
    <div className="entity-form">
      <h3 className="panel-title">Salió del almacén este mes</h3>
      {loading && <p className="muted">Sumando salidas...</p>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && grupos.length === 0 && <p className="muted">Todavía no salió nada este mes.</p>}
      {grupos.length > 0 && (
        <div className="avance-grid">
          {grupos.map((grupo) => (
            <div key={grupo.valor}>
              <strong><CategoriaIcono valor={grupo.valor} conNombre /></strong>
              <ul>
                {grupo.salidas.map((s) => (
                  <li key={s.insumoId}>
                    {s.nombre}: <strong>{formatCantidad(s.cantidad, s.unidadMedida)}</strong>
                    <span className="muted"> ({s.movimientos} {s.movimientos === 1 ? 'salida' : 'salidas'})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
