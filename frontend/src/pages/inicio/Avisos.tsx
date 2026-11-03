import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router';
import type { Aviso } from './construirAvisos';
import { Fila } from './Tarjetas';

export function AvisosInicio({ avisos }: { avisos: Aviso[] }) {
  if (avisos.length === 0) return null;
  return (
            <section className="atencion" aria-label="Requiere atención">
              <h2><TriangleAlert size={18} aria-hidden />Requiere atención ({avisos.length})</h2>
              <ul>
                {avisos.slice(0, 8).map((aviso) => (
                  <li key={aviso.clave}>
                    <Fila icono={aviso.icono}><Link to={aviso.a}>{aviso.titulo}</Link></Fila>
                    <small className="muted">{aviso.detalle}</small>
                  </li>
                ))}
              </ul>
              {avisos.length > 8 && <small className="muted">y {avisos.length - 8} más</small>}
            </section>
  );
}
