import { Suspense, useEffect, useRef } from 'react';
import { Outlet } from 'react-router';
import AvisoConexion from '../components/common/AvisoConexion';
import AvisoSinGuardar from '../components/common/AvisoSinGuardar';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { etiquetarTablas } from '../shared/utils/etiquetarTablas';
import { useAuth } from '../features/auth/context/useAuth';
import { precargarPaginas } from '../routes/paginas';

export default function MainLayout() {
  const { sesion, puedeVer } = useAuth();
  const rol = sesion?.rol;
  const contenido = useRef<HTMLElement>(null);

  useEffect(() => (contenido.current ? etiquetarTablas(contenido.current) : undefined), []);

  useEffect(() => {
    if (rol) precargarPaginas(puedeVer);
  }, [rol, puedeVer]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Header />
        <AvisoConexion />
        <main className="app-content" ref={contenido}>
          <Suspense fallback={<div className="state-card">Cargando...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <AvisoSinGuardar />
    </div>
  );
}
