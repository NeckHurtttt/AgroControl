// Formularios con cambios sin guardar. Basta con mirar los que siguen en pantalla: al guardar
// o cerrar, el formulario sale del documento y deja de contar solo.
const sucios = new WeakSet<HTMLFormElement>();

export function vigilarFormularios() {
  const alEscribir = (evento: Event) => {
    const formulario = (evento.target as Element | null)?.closest?.('form');
    if (formulario) sucios.add(formulario);
  };
  const alGuardar = (evento: Event) => {
    if (evento.target instanceof HTMLFormElement) sucios.delete(evento.target);
  };
  document.addEventListener('input', alEscribir);
  document.addEventListener('submit', alGuardar);
  document.addEventListener('reset', alGuardar);
  return () => {
    document.removeEventListener('input', alEscribir);
    document.removeEventListener('submit', alGuardar);
    document.removeEventListener('reset', alGuardar);
  };
}

export function hayCambiosSinGuardar(dentroDe: ParentNode = document) {
  return Array.from(dentroDe.querySelectorAll('form')).some((formulario) => sucios.has(formulario));
}
