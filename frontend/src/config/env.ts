// Única lectura de variables de entorno de Vite. Si falta VITE_API_URL la app falla
// al arrancar con un mensaje claro, en vez de pedir a "undefined/predios".
function leerApiUrl(): string {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error(
      'Falta VITE_API_URL. Defínela en .env.development o .env.production (ver .env.example).',
    );
  }
  return url.replace(/\/+$/, '');
}

export const API_URL = leerApiUrl();
