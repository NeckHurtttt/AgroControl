import { useCallback, useEffect, useRef, useState } from 'react';

const DURACION_MS = 2500;

/** Mensaje de éxito que se borra solo; el timeout se limpia al desmontar o al mostrar otro. */
export function useMensajeExito() {
  const [successMessage, setSuccessMessage] = useState('');
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const mostrarExito = useCallback((mensaje: string) => {
    window.clearTimeout(timeoutRef.current);
    setSuccessMessage(mensaje);
    timeoutRef.current = window.setTimeout(() => setSuccessMessage(''), DURACION_MS);
  }, []);

  return { successMessage, mostrarExito };
}
