import { test, expect } from '@playwright/test';

test('the collective solar fleet opens all project vessels', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.fleet-label')).toHaveCount(0);
  await page.getByRole('button',{name:'Explore My Works',exact:true}).press('Enter');
  await expect(page).toHaveURL(/\/works\/$/);
  await expect(page.getByRole('heading',{name:'My Works',exact:true})).toBeVisible();
  await expect(page.getByRole('complementary',{name:'About My Works'})).toBeVisible();
  await expect(page.locator('.fleet-label')).toHaveCount(8);
  const dock=page.getByRole('navigation',{name:'Select a fleet vessel'});
  await dock.getByRole('button',{name:/Rails Job-Hunting Support/}).click();
  await expect(page.getByRole('heading',{name:'Rails Job-Hunting Support'})).toBeVisible();
  await expect(page.locator('.works-status')).toHaveText('PROJECT NOTES');
  await dock.getByRole('button',{name:/My Dream: A Japanese Essay/}).click();
  await expect(page.getByRole('heading',{name:'My Dream: A Japanese Essay'})).toBeVisible();
  await page.getByRole('button',{name:'Fleet introduction'}).click();
  await expect(page.getByRole('complementary',{name:'About My Works'})).toBeVisible();
  await expect(page.getByRole('navigation',{name:'Main navigation'}).getByRole('button')).toHaveText(['Explore','About Me','Knowledge','My Works','Travel Earth','Inner Worlds','Timeline']);
});

test('works can be opened directly and the project dock stays accessible on mobile', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/works/?ship=communications');
  await expect(page.getByRole('heading',{name:'My Dream: A Japanese Essay'})).toBeVisible();
  await page.getByRole('button',{name:'Close work details'}).click();
  await expect(page.locator('.works-select-hint')).toBeVisible();
  await page.getByRole('navigation',{name:'Select a fleet vessel'}).getByRole('button',{name:/Rails Job-Hunting Support/}).click();
  await expect(page.getByRole('heading',{name:'Rails Job-Hunting Support'})).toBeVisible();
  await page.getByRole('button',{name:'Universe',exact:true}).click();
  await expect(page.locator('.hero')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('every project appears in My Works with accurate availability and links',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/works/');
 const dock=page.getByRole('navigation',{name:'Select a fleet vessel'});
 await expect(dock.getByRole('button')).toHaveCount(8);
 await dock.getByRole('button',{name:/RAG Study Assistant/}).click();
 await expect(page.getByRole('heading',{name:'RAG Study Assistant',exact:true})).toBeVisible();
 await expect(page.locator('.works-note a')).toHaveAttribute('href','https://jp-sns-mvp.vercel.app/ai-study');
 await dock.getByRole('button',{name:/Career Consultation Booking/}).click();
 await expect(page.locator('.works-status')).toContainText('SERVICE PAUSED');
 await dock.getByRole('button',{name:/Financial Web Service/}).click();
 await expect(page.locator('.works-status')).toHaveText('MVP IN DEVELOPMENT');
});
