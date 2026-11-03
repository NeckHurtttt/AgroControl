import { useCallback, useEffect, useRef, useState, type SetStateAction } from 'react';
import { guardarCache, leerCache, marcarConexion, tieneCache } from '../shared/utils/cacheDatos';
import { isAbortError } from '../shared/utils/isAbortError';

/**
 * Patrón de la Guía 05 (useEffect + AbortController + estados loading/error) extraído
 * a un hook para no repetirlo en cada página.
 *
 * - `cargar` recibe la señal de cancelación y devuelve la Promise con los datos.
 * - `clave` (opcional) vuelve a cargar cuando cambia, p. ej. el id de la labor seleccionada.
 * - `cache` (opcional) nombra la pantalla: al volver muestra lo último al instante mientras
 *   actualiza por detrás, y si falla la red conserva esos datos en vez de mostrar un error.
 * - `recargar()` vuelve a pedir los datos sin ocultar los que ya se muestran.
 */
export function useCarga<T>(
  cargar: (signal: AbortSignal) => Promise<T>,
  inicial: T,
  clave?: string | number,
  cache?: string,
) {
  const claveCache = cache ? `${cache}:${clave ?? ''}` : null;
  const [datos, setDatos] = useState<T>(() => (claveCache && tieneCache(claveCache) ? (leerCache(claveCache) as T) : inicial));
  const [loading, setLoading] = useState(!(claveCache && tieneCache(claveCache)));
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const cargarRef = useRef(cargar);
  const claveCacheRef = useRef(claveCache);

  // Guardamos los últimos valores sin convertirlos en dependencias del efecto de carga.
  useEffect(() => {
    cargarRef.current = cargar;
    claveCacheRef.current = claveCache;
  });

  useEffect(() => {
    const controller = new AbortController();
    const claveActual = claveCacheRef.current;

    const ejecutar = async () => {
      try {
        if (claveActual && tieneCache(claveActual)) {
          setDatos(leerCache(claveActual) as T);
          setLoading(false);
        } else if (version === 0) {
          setLoading(true);
        }
        setError('');
        const data = await cargarRef.current(controller.signal);
        setDatos(data);
        if (claveActual) {
          guardarCache(claveActual, data);
          marcarConexion(true);
        }
      } catch (err) {
        if (isAbortError(err)) return;
        // fetch rechaza con TypeError cuando no llega al servidor; una respuesta 4xx/5xx es ApiError.
        if (err instanceof TypeError && claveActual && tieneCache(claveActual)) {
          marcarConexion(false);
          return;
        }
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void ejecutar();
    return () => controller.abort();
  }, [version, clave]);

  const recargar = useCallback(() => setVersion((prev) => prev + 1), []);

  // Lo que la página cambia a mano (alta, edición) también debe verse al volver.
  const actualizarDatos = useCallback((valor: SetStateAction<T>) => {
    setDatos((prev) => {
      const nuevo = typeof valor === 'function' ? (valor as (anterior: T) => T)(prev) : valor;
      if (claveCacheRef.current) guardarCache(claveCacheRef.current, nuevo);
      return nuevo;
    });
  }, []);

  return { datos, setDatos: actualizarDatos, loading, error, recargar };
}
