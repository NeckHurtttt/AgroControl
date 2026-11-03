import { expect, test } from '@playwright/test';
import { entrar, ir, unico } from './ayuda';

// Lo que hace un cliente real: del predio a la cosecha, y verlo reflejado en las fichas.
test('del predio nuevo a la cosecha en su ficha', async ({ page }) => {
  const predio = `Predio E2E ${unico()}`;
  const parcela = `E2E-${unico()}`;
  await entrar(page, 'sergio@agrocontrol.com');

  await ir(page, 'Predios');
  await page.getByRole('button', { name: 'Nuevo predio' }).click();
  await page.getByLabel('Nombre').fill(predio);
  await page.getByLabel('Area (ha)').fill('120');
  await page.getByRole('button', { name: 'Guardar predio' }).click();
  await expect(page.getByText('Predio creado correctamente.')).toBeVisible();

  await ir(page, 'Parcelas');
  await page.getByRole('button', { name: 'Nueva parcela' }).click();
  await page.getByRole('dialog').getByLabel('Predio').selectOption({ label: predio });
  await page.getByLabel('Codigo').fill(parcela);
  await page.getByLabel('Area (ha)').fill('40');
  await page.getByRole('button', { name: 'Guardar parcela' }).click();
  await expect(page.getByRole('cell', { name: parcela })).toBeVisible();

  await ir(page, 'Campañas');
  await page.getByRole('button', { name: 'Nueva campaña' }).click();
  const campana = page.locator('form.entity-form');
  await campana.getByLabel('Parcela').selectOption({ label: `${predio} · ${parcela}` });
  await campana.getByLabel('Cultivo').selectOption({ index: 1 });
  await campana.getByLabel('Fecha de inicio').fill('2026-10-01');
  await page.getByRole('button', { name: 'Planificar campaña' }).click();
  await page.getByRole('searchbox').fill(parcela);
  const fila = page.getByRole('row', { name: new RegExp(parcela) });
  await fila.getByRole('button', { name: 'Iniciar' }).click();
  await expect(fila.getByRole('button', { name: 'Finalizar' })).toBeVisible();

  await ir(page, 'Cosechas');
  await page.getByRole('button', { name: 'Registrar cosecha' }).click();
  const cosecha = page.locator('form.entity-form');
  const opcion = await cosecha.getByLabel('Campaña').locator('option', { hasText: parcela }).getAttribute('value');
  await cosecha.getByLabel('Campaña').selectOption(opcion);
  await cosecha.getByLabel('Cantidad').fill('100');
  await cosecha.getByLabel('Unidad').selectOption('t');
  await page.getByRole('button', { name: 'Registrar cosecha', exact: true }).click();

  await ir(page, 'Predios');
  await page.getByRole('link', { name: predio }).click();
  await expect(page.getByRole('heading', { name: predio })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Cosecha neta por parcela' }).getByRole('link', { name: parcela })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Cosecha neta por parcela' })).toContainText('100');

  await page.getByRole('cell', { name: parcela }).getByRole('link').click();
  await expect(page.getByRole('list', { name: 'Rendimiento por campaña' })).toContainText('2,50 t/ha');
});
