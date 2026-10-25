import { apiFetch } from '../../../api/apiClient';
import type { Sesion } from '../models/Sesion';

export const authService = {
  login(email: string, password: string): Promise<Sesion> {
    return apiFetch<Sesion>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  yo(signal?: AbortSignal): Promise<Sesion> {
    return apiFetch<Sesion>('/auth/me', { signal });
  },
};
