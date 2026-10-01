const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  campos: Record<string, string>;

  constructor(status: number, message: string, campos: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.campos = campos;
  }
}

// Forma del ErrorResponse que devuelve GlobalExceptionHandler en Spring Boot.
interface ErrorResponseBody {
  mensaje?: string;
  campos?: Record<string, string>;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error('Falta VITE_API_URL');
  }

  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const detail = await response.text();
    let body: ErrorResponseBody = {};
    try {
      body = JSON.parse(detail) as ErrorResponseBody;
    } catch {
      // El backend respondió texto plano o nada: usamos el texto tal cual.
    }
    throw new ApiError(
      response.status,
      body.mensaje || detail || response.statusText || 'Error HTTP',
      body.campos,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
