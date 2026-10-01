import { Route, Routes } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import PrediosPage from '../features/predios/pages/PrediosPage';
import ParcelasPage from '../features/parcelas/pages/ParcelasPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="predios" element={<PrediosPage />} />
        <Route path="parcelas" element={<ParcelasPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
