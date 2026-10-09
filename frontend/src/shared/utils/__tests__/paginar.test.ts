import { describe, expect, it } from 'vitest';
import { paginar } from '../paginar';

const lista = Array.from({ length: 12 }, (_, i) => i + 1);

describe('paginar', () => {
  it('devuelve la porción de la página pedida', () => {
    const resultado = paginar(lista, 2, 5);
    expect(resultado.items).toEqual([6, 7, 8, 9, 10]);
    expect(resultado.totalPages).toBe(3);
    expect(resultado.totalItems).toBe(12);
  });

  it('corrige una página fuera de rango (p. ej. tras borrar el último de la última página)', () => {
    const resultado = paginar(lista.slice(0, 10), 3, 5);
    expect(resultado.page).toBe(2);
    expect(resultado.items).toEqual([6, 7, 8, 9, 10]);
  });

  it('con la lista vacía hay una sola página', () => {
    const resultado = paginar([], 4, 10);
    expect(resultado).toEqual({ items: [], page: 1, totalPages: 1, totalItems: 0 });
  });
});
