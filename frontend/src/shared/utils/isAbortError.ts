// fetch rechaza con un DOMException 'AbortError' cuando se cancela su AbortSignal:
// no es un fallo que deba verse en la UI.
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
