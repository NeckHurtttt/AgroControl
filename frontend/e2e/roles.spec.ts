import { expect, test } from '@playwright/test';
import { entrar } from './ayuda';

for (const [email, rol] of [
  ['sergio@agrocontrol.com', 'ADMINISTRADOR'],
  ['jefe@agrocontrol.com', 'JEFE DE CAMPO'],
  ['operario1@agrocontrol.com', 'OPERARIO'],
  ['almacen@agrocontrol.com', 'ALMACENERO'],
  ['supervisor@agrocontrol.com', 'SUPERVISOR'],
]) {
  test(`Inicio abre sin errores como ${rol}`, async ({ page }) => {
    const fallos: string[] = [];
    page.on('pageerror', (error) => fallos.push(error.message));
    page.on('response', (respuesta) => {
      if (respuesta.status() >= 400) fallos.push(`${respuesta.status()} ${respuesta.url()}`);
    });
    await entrar(page, email);
    await expect(page.getByText(`PANEL · ${rol}`)).toBeVisible();
    await expect(page.locator('.state-card.error')).toHaveCount(0);
    expect(fallos).toEqual([]);
  });
}
