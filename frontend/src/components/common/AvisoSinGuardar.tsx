import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ConfirmDialog from '../ui/ConfirmDialog';
import { hayCambiosSinGuardar, vigilarFormularios } from '../../shared/utils/formulariosSucios';

// Pregunta antes de salir de una pantalla con un formulario a medias, sea cual sea el formulario.
export default function AvisoSinGuardar() {
  const navigate = useNavigate();
  const [destino, setDestino] = useState<string | null>(null);

  useEffect(() => vigilarFormularios(), []);

  useEffect(() => {
    const alCerrarPestana = (evento: BeforeUnloadEvent) => {
      if (hayCambiosSinGuardar()) evento.preventDefault();
    };
    const alPulsarEnlace = (evento: MouseEvent) => {
      const enlace = (evento.target as Element | null)?.closest?.('a[href^="/"]');
      if (!enlace || !hayCambiosSinGuardar()) return;
      evento.preventDefault();
      evento.stopPropagation();
      setDestino(enlace.getAttribute('href'));
    };
    window.addEventListener('beforeunload', alCerrarPestana);
    document.addEventListener('click', alPulsarEnlace, true);
    return () => {
      window.removeEventListener('beforeunload', alCerrarPestana);
      document.removeEventListener('click', alPulsarEnlace, true);
    };
  }, []);

  return (
    <ConfirmDialog
      open={destino !== null}
      title="Cambios sin guardar"
      message="Si sale de esta pantalla se pierde lo que escribió."
      confirmLabel="Salir sin guardar"
      onConfirm={() => {
        if (destino) navigate(destino);
        setDestino(null);
      }}
      onCancel={() => setDestino(null)}
    />
  );
}
