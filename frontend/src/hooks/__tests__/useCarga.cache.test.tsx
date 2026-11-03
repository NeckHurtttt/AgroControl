import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { estaSinConexion, limpiarCache } from '../../shared/utils/cacheDatos';
import { useCarga } from '../useCarga';

afterEach(limpiarCache);

const cargarYDesmontar = async () => {
  const { result, unmount } = renderHook(() => useCarga(async () => 'primero', '', undefined, 'prueba'));
  await waitFor(() => expect(result.current.datos).toBe('primero'));
  unmount();
};

describe('useCarga con caché', () => {
  it('al volver muestra lo último al instante y actualiza por detrás', async () => {
    await cargarYDesmontar();
    const { result } = renderHook(() => useCarga(async () => 'nuevo', '', undefined, 'prueba'));
    expect(result.current.datos).toBe('primero');
    expect(result.current.loading).toBe(false);
    await waitFor(() => expect(result.current.datos).toBe('nuevo'));
  });

  it('sin red conserva los datos y avisa', async () => {
    await cargarYDesmontar();
    const { result } = renderHook(() => useCarga(() => Promise.reject(new TypeError('Failed to fetch')), '', undefined, 'prueba'));
    await waitFor(() => expect(estaSinConexion()).toBe(true));
    expect(result.current.datos).toBe('primero');
    expect(result.current.error).toBe('');
  });

  it('un error del servidor se muestra aunque haya caché', async () => {
    await cargarYDesmontar();
    const { result } = renderHook(() => useCarga(() => Promise.reject(new Error('Prohibido')), '', undefined, 'prueba'));
    await waitFor(() => expect(result.current.error).toBe('Prohibido'));
    expect(estaSinConexion()).toBe(false);
  });

  it('sin caché y sin red muestra el error', async () => {
    const { result } = renderHook(() => useCarga(() => Promise.reject(new TypeError('Failed to fetch')), '', undefined, 'otra'));
    await waitFor(() => expect(result.current.error).toBe('Failed to fetch'));
  });

  it('cerrar sesión borra lo guardado', async () => {
    await cargarYDesmontar();
    limpiarCache();
    const cargar = vi.fn(() => new Promise<string>(() => undefined));
    const { result } = renderHook(() => useCarga(cargar, 'vacío', undefined, 'prueba'));
    expect(result.current.datos).toBe('vacío');
    expect(result.current.loading).toBe(true);
  });

  it('lo que la página cambia a mano se ve al volver', async () => {
    const { result, unmount } = renderHook(() => useCarga(async () => ['a'], [] as string[], undefined, 'lista'));
    await waitFor(() => expect(result.current.datos).toEqual(['a']));
    result.current.setDatos((prev) => [...prev, 'b']);
    await waitFor(() => expect(result.current.datos).toEqual(['a', 'b']));
    unmount();
    const segundo = renderHook(() => useCarga(() => new Promise<string[]>(() => undefined), [] as string[], undefined, 'lista'));
    expect(segundo.result.current.datos).toEqual(['a', 'b']);
  });
});
