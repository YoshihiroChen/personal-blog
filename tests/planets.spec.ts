import { test, expect } from '@playwright/test';

test('the Sun can be hovered and clicked directly on the canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas bounds unavailable');
  // The Sun is at the camera target, at the centre of the canvas.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const sun = page.getByRole('link', { name: 'Explore Sun', exact: true });
  await expect(sun).toHaveClass(/hovered/);
  await expect(sun.locator('em')).toBeVisible();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/planets\/sun\/$/);
  await expect(page.getByRole('heading', { name: 'Hi, I’m Jiahong Chen.' })).toBeVisible();
});

test('start exploration keeps the solar system and every celestial body has a page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  await expect(page.locator('.solar-explore-caption')).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.hero')).not.toBeVisible();
  await expect(page.locator('footer, #content-navigation')).toHaveCount(0);
  const urls = ['sun','mercury','venus','earth','mars','jupiter','saturn','uranus','neptune','pluto','knowledge'].map(id=>`/planets/${id}/`);
  for (const url of urls) {
    await page.goto(url);
    if(url.includes('/sun/'))await expect(page.locator('.profile-sections')).toBeVisible();else if(url.includes('/knowledge/'))await expect(page.locator('.lunar-surface-heading h1')).toBeVisible();else await expect(page.locator('.section-heading h1')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
  }
  await page.goto('/planets/sun/');
  await expect(page.getByRole('heading', { name: 'Hi, I’m Jiahong Chen.', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
  await page.goto('/planets/knowledge/');
  await expect(page.getByRole('heading', { name: 'My Knowledge & Skills' })).toBeVisible();
  await expect(page.locator('.lunar-landing-strip button')).toHaveCount(2);
});

test('Earth and emotional planets open their matching 3D worlds', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/planets/earth/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name: 'Travel Earth' })).toHaveAttribute('aria-current','page');
  await page.goto('/planets/mercury/');
  await expect(page.locator('.section-heading h1')).toHaveText('Inner Worlds');
  await expect(page.getByRole('complementary').getByRole('heading', { name: /Mercury/ })).toBeVisible();
  await page.goto('/planets/sun/');
  await expect(page.locator('.sun-view canvas')).toBeVisible();
  await expect(page.getByRole('complementary').getByRole('heading', { name: 'Experience' })).toBeVisible();
});
