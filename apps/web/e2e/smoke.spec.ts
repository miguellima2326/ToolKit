import { expect, test } from '@playwright/test';

test('home carrega com hero e busca', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('só lugar');
  await expect(page.getByPlaceholder('Pesquisar apps, drivers ou ferramentas...')).toBeVisible();
});

test('catálogo lista aplicativos e abre página de app', async ({ page }) => {
  await page.goto('/apps');
  await page.waitForLoadState('networkidle');
  const firstCard = page.locator('article').first();
  await firstCard.locator('a').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Como instalar')).toBeVisible();
});

test('command palette abre com Ctrl+K e busca', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  await page.getByPlaceholder('Pesquisar apps, drivers ou ferramentas...').fill('chrome');
  await expect(page.getByRole('dialog')).toContainText(/Chrome/i);
});

test('adicionar ao toolkit atualiza contador', async ({ page }) => {
  await page.goto('/apps');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /Adicionar/ }).first().click();
  await expect(page.getByRole('link', { name: /Meu Toolkit/ })).toContainText('1');
});
