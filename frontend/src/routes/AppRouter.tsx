import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import NotFoundPage from '../pages/NotFoundPage';
import { RequireAuth, RequireSeccion } from '../features/auth/components/RequireAuth';
import CambiarPasswordPage from '../features/auth/pages/CambiarPasswordPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { PAGINAS } from './paginas';

const DashboardPage = lazy(PAGINAS.inicio);
const PrediosPage = lazy(PAGINAS.predios);
const FichaPredioPage = lazy(PAGINAS.fichaPredio);
const ParcelasPage = lazy(PAGINAS.parcelas);
const FichaParcelaPage = lazy(PAGINAS.fichaParcela);
const CultivosPage = lazy(PAGINAS.cultivos);
const CampanasPage = lazy(PAGINAS.campanas);
const FichaCampanaPage = lazy(PAGINAS.fichaCampana);
const LaboresPage = lazy(PAGINAS.labores);
const InsumosPage = lazy(PAGINAS.insumos);
const CosechasPage = lazy(PAGINAS.cosechas);
const IncidenciasPage = lazy(PAGINAS.incidencias);
const UsuariosPage = lazy(PAGINAS.usuarios);
const AuditoriaPage = lazy(PAGINAS.auditoria);

export default function AppRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="cambiar-password" element={<CambiarPasswordPage />} />
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route element={<RequireSeccion seccion="predios" />}>
            <Route path="predios" element={<PrediosPage />} />
            <Route path="predios/:id" element={<FichaPredioPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="parcelas" />}>
            <Route path="parcelas" element={<ParcelasPage />} />
            <Route path="parcelas/:id" element={<FichaParcelaPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="cultivos" />}>
            <Route path="cultivos" element={<CultivosPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="campanas" />}>
            <Route path="campanas" element={<CampanasPage />} />
            <Route path="campanas/:id" element={<FichaCampanaPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="labores" />}>
            <Route path="labores" element={<LaboresPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="insumos" />}>
            <Route path="insumos" element={<InsumosPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="cosechas" />}>
            <Route path="cosechas" element={<CosechasPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="incidencias" />}>
            <Route path="incidencias" element={<IncidenciasPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="usuarios" />}>
            <Route path="usuarios" element={<UsuariosPage />} />
          </Route>
          <Route element={<RequireSeccion seccion="auditoria" />}>
            <Route path="auditoria" element={<AuditoriaPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
