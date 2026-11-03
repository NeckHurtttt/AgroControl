import { expect, type Page } from '@playwright/test';

export async function entrar(page: Page, email: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel(/contraseña/i).fill('agro123');
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await expect(page.getByRole('heading', { name: /^Hola/ })).toBeVisible();
}

export const ir = (page: Page, nombre: string) =>
  page.locator('.sidebar').getByRole('link', { name: nombre, exact: true }).click();

export const unico = () => Date.now().toString(36).toUpperCase();
