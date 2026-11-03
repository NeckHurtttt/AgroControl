// Últimos datos recibidos por pantalla, solo en memoria: permiten volver a una pestaña sin
// esperar y seguir viéndola si se corta la señal. Se borran al cerrar sesión.
const datos = new Map<string, unknown>();
const oyentes = new Set<() => void>();
let sinConexion = false;

export const leerCache = (clave: string) => datos.get(clave);
export const tieneCache = (clave: string) => datos.has(clave);
export const guardarCache = (clave: string, valor: unknown) => { datos.set(clave, valor); };

export function marcarConexion(hayConexion: boolean) {
  if (sinConexion === !hayConexion) return;
  sinConexion = !hayConexion;
  oyentes.forEach((oyente) => oyente());
}

export function limpiarCache() {
  datos.clear();
  marcarConexion(true);
}

export const estaSinConexion = () => sinConexion;

export function alCambiarConexion(oyente: () => void) {
  oyentes.add(oyente);
  return () => { oyentes.delete(oyente); };
}
