import { NavLink } from 'react-router';

const menuItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/predios', label: 'Predios' },
  { to: '/parcelas', label: 'Parcelas' },
  { to: '/cultivos', label: 'Cultivos' },
  { to: '/campanas', label: 'Campañas' },
  { to: '/labores', label: 'Labores' },
  { to: '/insumos', label: 'Insumos' },
  { to: '/cosechas', label: 'Cosechas' },
  { to: '/incidencias', label: 'Incidencias' },
];

export default function Sidebar() {
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
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
