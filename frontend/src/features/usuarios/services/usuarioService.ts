import { apiFetch } from '../../../api/apiClient';
import type { Usuario } from '../models/Usuario';

export interface UsuarioCreateRequest {
  rolId: number;
  nombreCompleto: string;
  email: string;
  password: string;
}

export const usuarioService = {
  listar(signal?: AbortSignal): Promise<Usuario[]> {
    return apiFetch<Usuario[]>('/usuarios', { signal });
  },

  crear(data: UsuarioCreateRequest): Promise<Usuario> {
    return apiFetch<Usuario>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export function nombreUsuario(usuarios: Usuario[], id: number): string {
  return usuarios.find((usuario) => usuario.id === id)?.nombreCompleto ?? `Usuario ${id}`;
}
