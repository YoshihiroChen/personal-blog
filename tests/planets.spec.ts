import { test, expect } from '@playwright/test';

test('the Sun can be hovered and clicked directly on the canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: '开始探索' }).click();
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas bounds unavailable');
  // The Sun is at the camera target, at the centre of the canvas.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const sun = page.getByRole('link', { name: '探索太阳', exact: true });
  await expect(sun).toHaveClass(/hovered/);
  await expect(sun.locator('em')).toBeVisible();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/planets\/sun\/$/);
  await expect(page.getByRole('heading', { name: '太阳 · 关于我' })).toBeVisible();
});

test('start exploration keeps the solar system and every celestial body has a page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: '开始探索' }).click();
  await expect(page.locator('.solar-explore-caption')).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.hero')).not.toBeVisible();
  const directory = page.getByRole('navigation', { name: '星球页面' });
  await expect(directory.getByRole('link')).toHaveCount(11);
  const urls = await directory.getByRole('link').evaluateAll(links => links.map(link => link.getAttribute('href')!));
  for (const url of urls) {
    await page.goto(url);
    await expect(page.locator('h1')).toBeVisible();
    if(url.includes('/knowledge/'))await expect(page.getByRole('link', { name: '返回宇宙' })).toBeVisible();else await expect(page.locator('canvas')).toBeVisible();
  }
  await page.goto('/planets/sun/');
  await expect(page.getByRole('heading', { name: '太阳 · 关于我', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '我是谁' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: '我是谁' })).toBeVisible();
  await page.goto('/planets/knowledge/');
  await page.getByRole('link', { name: '打开完整知识与成长档案' }).click();
  await expect(page).toHaveURL(/\/knowledge\/$/);
});

test('Earth and emotional planets open their matching 3D worlds', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/planets/earth/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: '旅行地球' })).toHaveAttribute('aria-current','page');
  await page.goto('/planets/mercury/');
  await expect(page.locator('.section-heading h1')).toHaveText('情绪与人生');
  await expect(page.getByRole('complementary').getByRole('heading', { name: /水星/ })).toBeVisible();
  await page.goto('/planets/sun/');
  await expect(page.locator('.sun-view canvas')).toBeVisible();
  await expect(page.getByRole('complementary').getByRole('heading', { name: '我是谁' })).toBeVisible();
});
