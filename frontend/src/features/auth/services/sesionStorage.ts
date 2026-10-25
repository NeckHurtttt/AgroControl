import type { Sesion } from '../models/Sesion';

// La sesión vive en localStorage para sobrevivir a un F5; apiClient lee el token de aquí.
const CLAVE = 'agrocontrol-roles.sesion';

export function leerSesion(): Sesion | null {
  try {
    const guardada = localStorage.getItem(CLAVE);
    return guardada ? (JSON.parse(guardada) as Sesion) : null;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion: Sesion | null) {
  try {
    if (sesion) localStorage.setItem(CLAVE, JSON.stringify(sesion));
    else localStorage.removeItem(CLAVE);
  } catch {
    // Sin localStorage (modo privado): la sesión dura hasta recargar.
  }
}
