import type { Rol } from './models/Sesion';

// Misma matriz que SecurityConfig en el backend: el front oculta lo que el rol no puede hacer
// y el backend lo rechaza con 403 si alguien lo intenta igual.

export const NOMBRE_ROL: Record<Rol, string> = {
  ADMINISTRADOR: 'Administrador',
  JEFE_DE_CAMPO: 'Jefe de campo',
  OPERARIO: 'Operario',
  ALMACENERO: 'Almacenero',
  SUPERVISOR: 'Supervisor',
};

export type Seccion =
  | 'inicio' | 'predios' | 'parcelas' | 'cultivos' | 'campanas' | 'labores' | 'insumos' | 'cosechas' | 'incidencias' | 'usuarios';

const SECCIONES: Record<Rol, Seccion[]> = {
  ADMINISTRADOR: ['inicio', 'predios', 'parcelas', 'cultivos', 'campanas', 'labores', 'insumos', 'cosechas', 'incidencias', 'usuarios'],
  JEFE_DE_CAMPO: ['inicio', 'predios', 'parcelas', 'cultivos', 'campanas', 'labores', 'insumos', 'cosechas', 'incidencias'],
  OPERARIO: ['inicio', 'labores', 'incidencias'],
  ALMACENERO: ['inicio', 'insumos', 'cosechas'],
  SUPERVISOR: ['inicio', 'predios', 'parcelas', 'cultivos', 'campanas', 'labores', 'insumos', 'cosechas', 'incidencias'],
};

export type Accion =
  | 'predios.editar'
  | 'parcelas.editar'
  | 'cultivos.crear'
  | 'campanas.gestionar'
  | 'labores.planificar'
  | 'labores.ejecutar'
  | 'insumos.gestionar'
  | 'insumos.verMovimientos'
  | 'cosechas.registrar'
  | 'incidencias.reportar'
  | 'usuarios.gestionar';

const ACCIONES: Record<Accion, Rol[]> = {
  'predios.editar': ['ADMINISTRADOR'],
  'parcelas.editar': ['ADMINISTRADOR'],
  'cultivos.crear': ['ADMINISTRADOR', 'JEFE_DE_CAMPO'],
  'campanas.gestionar': ['ADMINISTRADOR', 'JEFE_DE_CAMPO'],
  'labores.planificar': ['ADMINISTRADOR', 'JEFE_DE_CAMPO'],
  'labores.ejecutar': ['ADMINISTRADOR', 'JEFE_DE_CAMPO', 'OPERARIO'],
  'insumos.gestionar': ['ADMINISTRADOR', 'ALMACENERO'],
  'insumos.verMovimientos': ['ADMINISTRADOR', 'ALMACENERO', 'JEFE_DE_CAMPO', 'SUPERVISOR'],
  'cosechas.registrar': ['ADMINISTRADOR', 'JEFE_DE_CAMPO', 'ALMACENERO'],
  // Las reporta quien está en el campo; el supervisor solo las revisa
  'incidencias.reportar': ['ADMINISTRADOR', 'JEFE_DE_CAMPO', 'OPERARIO'],
  'usuarios.gestionar': ['ADMINISTRADOR'],
};

export function puedeVer(rol: Rol, seccion: Seccion): boolean {
  return SECCIONES[rol].includes(seccion);
}

export function puede(rol: Rol, accion: Accion): boolean {
  return ACCIONES[accion].includes(rol);
}
