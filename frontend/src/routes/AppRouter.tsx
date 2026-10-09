import { Route, Routes } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import PrediosPage from '../features/predios/pages/PrediosPage';
import ParcelasPage from '../features/parcelas/pages/ParcelasPage';
import CultivosPage from '../features/cultivos/pages/CultivosPage';
import CampanasPage from '../features/campanas/pages/CampanasPage';
import LaboresPage from '../features/labores/pages/LaboresPage';
import InsumosPage from '../features/insumos/pages/InsumosPage';
import CosechasPage from '../features/cosechas/pages/CosechasPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="predios" element={<PrediosPage />} />
        <Route path="parcelas" element={<ParcelasPage />} />
        <Route path="cultivos" element={<CultivosPage />} />
        <Route path="campanas" element={<CampanasPage />} />
        <Route path="labores" element={<LaboresPage />} />
        <Route path="insumos" element={<InsumosPage />} />
        <Route path="cosechas" element={<CosechasPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
