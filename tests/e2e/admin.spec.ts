import { expect, test } from '@playwright/test';

test('admin CMS loads after login without a fetch or decoding error', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByLabel('Email', { exact: true }).fill('admin@dhisoft.com');
  await page.getByLabel('Password', { exact: true }).fill('ChangeMe123!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin\/content$/);
  await expect(page.getByRole('heading', { name: 'Draft editor' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('Failed to fetch')).toHaveCount(0);
});
