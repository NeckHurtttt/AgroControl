import { expect, test } from '@playwright/test';
import { entrar } from './ayuda';

test.use({ viewport: { width: 390, height: 780 } });

test('ninguna pantalla se sale de un celular y las tablas se leen como tarjetas', async ({ page }) => {
  await entrar(page, 'jefe@agrocontrol.com');
  for (const ruta of ['/', '/predios', '/parcelas', '/cultivos', '/campanas', '/labores', '/insumos', '/cosechas', '/incidencias']) {
    await page.goto(ruta);
    await expect(page.locator('.state-card')).toHaveCount(0);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho, ruta).toBeLessThanOrEqual(390);
  }
  await page.goto('/predios');
  await expect(page.locator('tbody td').first()).toHaveAttribute('data-etiqueta', 'ID');
});
