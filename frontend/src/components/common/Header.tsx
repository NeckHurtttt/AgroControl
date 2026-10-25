import { useNavigate } from 'react-router';
import { useAuth } from '../../features/auth/context/useAuth';
import { NOMBRE_ROL } from '../../features/auth/permisos';

export default function Header() {
  const { sesion, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">Trazabilidad de campo</p>
        <h1>AgroControl</h1>
      </div>
      {sesion && (
        <div className="topbar__user">
          <div className="topbar__user-name">
            <strong>{sesion.nombreCompleto}</strong>
            <small>{sesion.email}</small>
          </div>
          <span className="topbar__status">{NOMBRE_ROL[sesion.rol]}</span>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              cerrarSesion();
              navigate('/login', { replace: true });
            }}
          >
            Salir
          </button>
        </div>
      )}
    </header>
  );
}
