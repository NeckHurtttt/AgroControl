import type { Seccion } from '../features/auth/permisos';

// Cada pantalla es un archivo aparte que se baja al entrar a ella.
export const PAGINAS = {
  inicio: () => import('../pages/DashboardPage'),
  predios: () => import('../features/predios/pages/PrediosPage'),
  fichaPredio: () => import('../features/predios/pages/FichaPredioPage'),
  parcelas: () => import('../features/parcelas/pages/ParcelasPage'),
  fichaParcela: () => import('../features/parcelas/pages/FichaParcelaPage'),
  cultivos: () => import('../features/cultivos/pages/CultivosPage'),
  campanas: () => import('../features/campanas/pages/CampanasPage'),
  fichaCampana: () => import('../features/campanas/pages/FichaCampanaPage'),
  labores: () => import('../features/labores/pages/LaboresPage'),
  insumos: () => import('../features/insumos/pages/InsumosPage'),
  cosechas: () => import('../features/cosechas/pages/CosechasPage'),
  incidencias: () => import('../features/incidencias/pages/IncidenciasPage'),
  usuarios: () => import('../features/usuarios/pages/UsuariosPage'),
  auditoria: () => import('../features/auditoria/pages/AuditoriaPage'),
};

const SECCION_DE: Record<keyof typeof PAGINAS, Seccion> = {
  inicio: 'inicio',
  predios: 'predios',
  fichaPredio: 'predios',
  parcelas: 'parcelas',
  fichaParcela: 'parcelas',
  cultivos: 'cultivos',
  campanas: 'campanas',
  fichaCampana: 'campanas',
  labores: 'labores',
  insumos: 'insumos',
  cosechas: 'cosechas',
  incidencias: 'incidencias',
  usuarios: 'usuarios',
  auditoria: 'auditoria',
};

// Tras entrar se baja en segundo plano lo que el rol puede abrir: si después se corta
// la señal, cambiar de pestaña sigue funcionando.
export function precargarPaginas(puedeVer: (seccion: Seccion) => boolean) {
  const pendientes = (Object.keys(PAGINAS) as (keyof typeof PAGINAS)[]).filter((pagina) => puedeVer(SECCION_DE[pagina]));
  const precargar = () => pendientes.forEach((pagina) => void PAGINAS[pagina]().catch(() => undefined));
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(precargar);
  else window.setTimeout(precargar, 1000);
}
