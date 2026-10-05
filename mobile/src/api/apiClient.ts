// En el celular (Expo Go) "localhost" es el propio teléfono: usar la IP de la PC en EXPO_PUBLIC_API_URL.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Forma del ProblemDetail (RFC 9457) que devuelve GlobalExceptionHandler en Spring Boot.
interface ProblemDetailBody {
  title?: string;
  detail?: string;
  errores?: Record<string, string>;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new ApiError(0, `No se pudo conectar con la API (${API_URL}).`);
  }

  if (!response.ok) {
    const texto = await response.text();
    let body: ProblemDetailBody = {};
    try {
      body = JSON.parse(texto) as ProblemDetailBody;
    } catch {
      // El backend respondió texto plano o nada: usamos el texto tal cual.
    }
    const campos = body.errores ? Object.values(body.errores).join(' ') : '';
    throw new ApiError(response.status, campos || body.detail || body.title || texto || 'Error HTTP');
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
