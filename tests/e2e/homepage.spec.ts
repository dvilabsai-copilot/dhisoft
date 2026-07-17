import { expect, test } from '@playwright/test';

test.describe('public homepage', () => {
  test('renders CMS content, preserves the animation layout, and submits a mocked enquiry', async ({ page }) => {
    await page.route('**/api/leads', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, reference: 'playwright-test' }) });
    });

    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Everything your travel operation needs to move faster/i })).toBeVisible();
    await expect(page.getByText('Fleet & Vendor SaaS')).toBeVisible();

    const fitsViewport = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    expect(fitsViewport).toBe(true);

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.getByLabel('Name', { exact: true }).fill('Playwright Tester');
    await page.getByLabel('Email', { exact: true }).fill('playwright@example.com');
    await page.getByLabel('Project enquiry', { exact: true }).fill('We need a CMS-connected SaaS website.');
    await page.getByRole('button', { name: 'Send enquiry' }).click();
    await expect(page.getByText(/your enquiry was saved/i)).toBeVisible();
  });

  test('renders key content and navigation affordances on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Book Demo' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Build smarter booking/i })).toBeVisible();
    await expect(page.locator('#products')).toBeVisible();
    await expect(page.locator('#contact')).toBeAttached();
    const fitsViewport = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    expect(fitsViewport).toBe(true);
  });
});
