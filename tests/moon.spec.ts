import { test, expect } from '@playwright/test';

test('Moon bases lead to chambers, workstations, notes, and back to the surface', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/planets/knowledge/');
  await expect(page.getByRole('heading', { name: 'A place to keep exploring.' })).toBeVisible();
  await expect(page.locator('.planet-label')).toHaveCount(0);
  await expect(page.locator('.story-panel')).toHaveCount(0);
  await page.locator('.lunar-landing-strip').getByRole('button', { name: /Technology/ }).click();
  await expect(page.getByRole('heading', { name: 'Technology Base' })).toBeVisible();
  await expect(page.locator('.base-chamber')).toHaveCount(5);
  await page.getByRole('button', { name: 'Explore Frontend chamber' }).click();
  await page.getByRole('button', { name: /DESK.*React/ }).click();
  await page.getByRole('button', { name: /DESK.*Next.js/ }).click();
  await expect(page.locator('.lunar-base-header h1')).toHaveText('Next.js');
  const trail = page.getByRole('navigation', { name: 'Lunar exploration path' });
  await expect(trail).toContainText('Frontend');
  await expect(trail).toContainText('React');
  await trail.getByRole('button', { name: 'Moon', exact: true }).click();
  await page.locator('.lunar-landing-strip').getByRole('button', { name: /Languages/ }).click();
  await page.getByRole('button', { name: 'Explore Japanese chamber' }).click();
  await page.getByRole('button', { name: /Another Language, Another Way of Seeing/ }).click();
  const note = page.getByRole('dialog', { name: 'Another Language, Another Way of Seeing' });
  await expect(note.getByText('Learning a language changes what you notice.', { exact: false })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(note).toHaveCount(0);
  await expect(page.locator('.lunar-base-header h1')).toHaveText('Japanese');
  await page.getByRole('button', { name: 'Step back' }).click();
  await expect(page.getByRole('heading', { name: 'Languages Base' })).toBeVisible();
  await page.getByRole('button', { name: 'Moon surface' }).click();
  await expect(page.getByRole('heading', { name: 'A place to keep exploring.' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('deep links and mobile floor plans preserve access to all chambers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?node=nextjs');
  await expect(page.locator('.lunar-base-header h1')).toHaveText('Next.js');
  await page.getByRole('navigation', { name: 'Lunar exploration path' }).getByRole('button', { name: 'Technology', exact: true }).click();
  const ai = page.getByRole('button', { name: 'Explore Artificial Intelligence chamber' });
  await ai.scrollIntoViewIfNeeded();
  await ai.click();
  await expect(page.locator('.lunar-base-header h1')).toHaveText('Artificial Intelligence');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
