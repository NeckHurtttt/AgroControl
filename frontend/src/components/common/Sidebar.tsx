import {
  CalendarRange, Grid2x2, House, LandPlot, ScrollText, Sprout, Tractor, TriangleAlert, Users, Warehouse, Wheat,
  type LucideIcon,
} from 'lucide-react';
import { NavLink } from 'react-router';
import { useAuth } from '../../features/auth/context/useAuth';
import type { Seccion } from '../../features/auth/permisos';

const menuItems: { to: string; label: string; seccion: Seccion; icono: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'Inicio', seccion: 'inicio', icono: House, end: true },
  { to: '/predios', label: 'Predios', seccion: 'predios', icono: LandPlot },
  { to: '/parcelas', label: 'Parcelas', seccion: 'parcelas', icono: Grid2x2 },
  { to: '/cultivos', label: 'Cultivos', seccion: 'cultivos', icono: Sprout },
  { to: '/campanas', label: 'Campañas', seccion: 'campanas', icono: CalendarRange },
  { to: '/labores', label: 'Labores', seccion: 'labores', icono: Tractor },
  { to: '/insumos', label: 'Insumos', seccion: 'insumos', icono: Warehouse },
  { to: '/cosechas', label: 'Cosechas', seccion: 'cosechas', icono: Wheat },
  { to: '/incidencias', label: 'Incidencias', seccion: 'incidencias', icono: TriangleAlert },
  { to: '/usuarios', label: 'Usuarios', seccion: 'usuarios', icono: Users },
  { to: '/auditoria', label: 'Auditoría', seccion: 'auditoria', icono: ScrollText },
];

export default function Sidebar() {
  const { sesion, puedeVer } = useAuth();
  // El operario solo tiene su agenda: el menú lo dice con sus palabras
  const etiqueta = (item: (typeof menuItems)[number]) =>
    item.seccion === 'labores' && sesion?.rol === 'OPERARIO' ? 'Mis labores' : item.label;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">A</span>
        <div>
          <strong>AgroControl</strong>
          <small>Gestión agrícola</small>
        </div>
      </div>
      <nav className="sidebar__nav" aria-label="Navegación principal">
        {menuItems.filter((item) => puedeVer(item.seccion)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <item.icono size={18} strokeWidth={2} aria-hidden />
            {etiqueta(item)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
