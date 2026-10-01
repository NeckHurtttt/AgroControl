import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Patrón de la Guía 05 (useEffect + AbortController + estados loading/error) extraído
 * a un hook para no repetirlo en cada página.
 *
 * - `cargar` recibe la señal de cancelación y devuelve la Promise con los datos.
 * - `clave` (opcional) vuelve a cargar cuando cambia, p. ej. el id de la labor seleccionada.
 * - `recargar()` vuelve a pedir los datos sin ocultar los que ya se muestran.
 */
export function useCarga<T>(
  cargar: (signal: AbortSignal) => Promise<T>,
  inicial: T,
  clave?: string | number,
) {
  const [datos, setDatos] = useState<T>(inicial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const cargarRef = useRef(cargar);

  // Guardamos la última función sin convertirla en dependencia del efecto de carga.
  useEffect(() => {
    cargarRef.current = cargar;
  });

  useEffect(() => {
    const controller = new AbortController();

    const ejecutar = async () => {
      try {
        if (version === 0) setLoading(true);
        setError('');
        const data = await cargarRef.current(controller.signal);
        setDatos(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void ejecutar();
    return () => controller.abort();
  }, [version, clave]);

  const recargar = useCallback(() => setVersion((prev) => prev + 1), []);

  return { datos, setDatos, loading, error, recargar };
}
