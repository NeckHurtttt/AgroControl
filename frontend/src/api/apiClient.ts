import { API_URL } from '../config/env';

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

// Forma del ProblemDetail (RFC 9457) que devuelve GlobalExceptionHandler en Spring Boot.
interface ProblemDetailBody {
  title?: string;
  detail?: string;
  errores?: Record<string, string>;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
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
    let body: ProblemDetailBody = {};
    try {
      body = JSON.parse(detail) as ProblemDetailBody;
    } catch {
      // El backend respondió texto plano o nada: usamos el texto tal cual.
    }
    throw new ApiError(
      response.status,
      body.detail || body.title || detail || response.statusText || 'Error HTTP',
      body.errores,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
