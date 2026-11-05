import { test, expect } from '@playwright/test';

test('the solar map flagship opens My Works and the two project vessels', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await page.getByRole('button',{name:'Open My Works',exact:true}).click();
  await expect(page.getByRole('heading',{name:'My Works',exact:true})).toBeVisible();
  await expect(page.getByRole('complementary',{name:'About My Works'})).toBeVisible();
  await expect(page.locator('.fleet-label')).toHaveCount(3);
  const dock=page.getByRole('navigation',{name:'Select a fleet vessel'});
  await dock.getByRole('button',{name:/Research Vessel/}).click();
  await expect(page.getByRole('heading',{name:'IT Project 01'})).toBeVisible();
  await expect(page.locator('.works-status')).toHaveText('DETAILS COMING SOON');
  await dock.getByRole('button',{name:/Communications Vessel/}).click();
  await expect(page.getByRole('heading',{name:'Language Project 01'})).toBeVisible();
  await page.getByRole('button',{name:'Fleet introduction'}).click();
  await expect(page.getByRole('complementary',{name:'About My Works'})).toBeVisible();
  await expect(page.getByRole('navigation',{name:'Main navigation'}).getByRole('button')).toHaveText(['Explore','About Me','Knowledge','My Works','Travel Earth','Inner Worlds','Timeline']);
});

test('works can be opened directly and the project dock stays accessible on mobile', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/works/?ship=communications');
  await expect(page.getByRole('heading',{name:'Language Project 01'})).toBeVisible();
  await page.getByRole('button',{name:'Close work details'}).click();
  await expect(page.locator('.works-select-hint')).toBeVisible();
  await page.getByRole('navigation',{name:'Select a fleet vessel'}).getByRole('button',{name:/Research Vessel/}).click();
  await expect(page.getByRole('heading',{name:'IT Project 01'})).toBeVisible();
  await page.getByRole('button',{name:'Universe',exact:true}).click();
  await expect(page.locator('.hero')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
