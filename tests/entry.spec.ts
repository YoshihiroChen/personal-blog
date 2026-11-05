import { test, expect } from '@playwright/test';
test('entrance flight reveals the interface once and keeps the manual toggle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero')).not.toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).not.toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.hero')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.webgl-fallback')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('h');
  await expect(page.locator('.hero')).not.toBeVisible();
  await page.waitForTimeout(5500);
  await expect(page.locator('.hero')).not.toBeVisible();
  await page.getByRole('button', { name: 'Show navigation and introduction' }).click();
  await expect(page.locator('.hero')).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.webgl-fallback')).toHaveCount(0);
});
test('reduced motion and direct celestial links skip the entrance', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero')).toBeVisible();
  await page.goto('/?node=knowledge');
  await expect(page.getByRole('heading', { name: 'My Knowledge & Skills' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
});
