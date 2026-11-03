import { expect, test } from '@playwright/test';
import { entrar, ir } from './ayuda';

test('no se pierde un formulario a medias sin preguntar', async ({ page }) => {
  await entrar(page, 'sergio@agrocontrol.com');
  await ir(page, 'Predios');
  await page.getByRole('button', { name: 'Nuevo predio' }).click();

  // Sin escribir nada, cierra directo
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: 'Nuevo predio' }).click();
  await page.getByLabel('Nombre').fill('A medias');
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await expect(page.getByText('Hay cambios sin guardar.')).toBeVisible();
  await page.getByRole('button', { name: 'Seguir editando' }).click();
  await expect(page.getByLabel('Nombre')).toHaveValue('A medias');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Descartar' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('avisa al cambiar de pestaña con un formulario abierto', async ({ page }) => {
  await entrar(page, 'jefe@agrocontrol.com');
  await ir(page, 'Cosechas');
  await page.getByRole('button', { name: 'Registrar cosecha' }).click();
  await page.getByLabel('Cantidad').fill('5');
  await ir(page, 'Insumos');
  await expect(page.getByRole('dialog', { name: 'Cambios sin guardar' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar' }).last().click();
  await expect(page.getByLabel('Cantidad')).toHaveValue('5');
  await ir(page, 'Insumos');
  await page.getByRole('button', { name: 'Salir sin guardar' }).click();
  await expect(page).toHaveURL(/insumos/);
});

test('sin señal sigue mostrando lo último y avisa', async ({ page }) => {
  await entrar(page, 'jefe@agrocontrol.com');
  await ir(page, 'Predios');
  await expect(page.locator('tbody tr').first()).toBeVisible();
  await ir(page, 'Cultivos');
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await page.route('**/api/**', (ruta) => ruta.abort());
  await ir(page, 'Predios');
  await expect(page.getByText('Sin conexión: se muestran los últimos datos cargados.')).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await page.unroute('**/api/**');
  await ir(page, 'Cultivos');
  await expect(page.getByText(/Sin conexión/)).toHaveCount(0);
});
