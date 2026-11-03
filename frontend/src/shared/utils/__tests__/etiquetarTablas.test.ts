import { describe, expect, it } from 'vitest';
import { etiquetarTablas } from '../etiquetarTablas';

const tabla = '<table class="data-table"><thead><tr><th>Código</th><th>Área</th></tr></thead><tbody><tr><td>P-01</td><td>40 ha</td></tr></tbody></table>';

describe('etiquetarTablas', () => {
  it('copia el título de la columna a cada celda, también en filas nuevas', async () => {
    const contenedor = document.createElement('div');
    contenedor.innerHTML = tabla;
    const parar = etiquetarTablas(contenedor);
    expect(contenedor.querySelector('td')?.getAttribute('data-etiqueta')).toBe('Código');

    contenedor.querySelector('tbody')?.insertAdjacentHTML('beforeend', '<tr><td>P-02</td><td>10 ha</td></tr>');
    await Promise.resolve();
    expect(contenedor.querySelectorAll('tr')[2].children[1].getAttribute('data-etiqueta')).toBe('Área');
    parar();
  });
});
