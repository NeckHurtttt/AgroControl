import { WifiOff } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { alCambiarConexion, estaSinConexion } from '../../shared/utils/cacheDatos';

export default function AvisoConexion() {
  const sinConexion = useSyncExternalStore(alCambiarConexion, estaSinConexion);
  if (!sinConexion) return null;
  return (
    <div className="aviso-conexion" role="status">
      <WifiOff size={16} aria-hidden />Sin conexión: se muestran los últimos datos cargados.
    </div>
  );
}
