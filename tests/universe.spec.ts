import { test,expect } from '@playwright/test';
test('desktop WebGL, recursive navigation, stories, travel, search and settings',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
 await expect(page.locator('.hero')).toBeVisible();
 await expect(page.locator('canvas')).toBeVisible();
 await expect(page.locator('.planet-label')).toHaveCount(11,{timeout:60000});
 await page.waitForTimeout(2500);await page.screenshot({path:'docs/preview-desktop.png'});
 await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
 await page.getByRole('button',{name:'Visual settings'}).click();await page.getByRole('button',{name:'Low'}).click();await expect(page.getByRole('switch',{name:/Reduce motion/})).toHaveAttribute('aria-checked','true');await page.getByRole('button',{name:'Close settings'}).click();
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Knowledge',exact:true}).click();
 await page.locator('.lunar-landing-strip').getByRole('button',{name:/Languages/}).click();
 await page.getByRole('button',{name:'Explore Japanese chamber'}).click();
 await page.getByRole('button',{name:/Another Language, Another Way of Seeing/}).click();
 await expect(page.getByRole('dialog',{name:'Another Language, Another Way of Seeing'})).toBeVisible();
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Quick Find'}).click();await page.getByRole('textbox',{name:'Search by name'}).fill('Next.js');await page.getByRole('dialog',{name:'Search this universe'}).getByRole('button',{name:/Next.js/}).click();
 await expect(page.locator('.lunar-base-header h1')).toHaveText('Next.js');await expect(page.locator('footer')).toHaveCount(0);
 const panel=page.getByRole('complementary',{name:'Explore content'});
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Travel Earth'}).click();await expect(panel).toHaveCount(0);await expect(page.locator('.city-label, .year-control')).toHaveCount(0);await page.waitForTimeout(2500);await page.screenshot({path:'docs/preview-earth.png'});
 await page.getByRole('button',{name:'Visual settings'}).click();await page.getByRole('button',{name:'Low'}).click();await expect(page.getByRole('switch')).toHaveAttribute('aria-checked','true');
 expect(errors).toEqual([]);
});
test('static reading pages work without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 for(const path of ['/knowledge/','/travels/','/stories/','/stories/japanese/']){const response=await page.goto(path);expect(response?.status()).toBe(200);await expect(page.getByRole('heading',{level:1})).toBeVisible();}
 await context.close();
});
test('mobile has no horizontal overflow and opens an individual inner world',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await page.waitForTimeout(2000);await page.screenshot({path:'docs/preview-mobile.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Inner Worlds'}).click();await page.getByRole('button',{name:'Mercury · Adrift Uncertainty · Discovery'}).click();
 const panel=page.getByRole('complementary',{name:'Explore content'});await expect(panel).toBeVisible();await panel.getByRole('button',{name:/A Little While at Sea/}).click();await expect(panel.getByRole('heading',{name:'A Little While at Sea'})).toBeVisible();await page.screenshot({path:'docs/preview-mobile-story.png'});
});
test('Travel Earth keeps labels and its content panel hidden until a point is selected',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/?node=earth');
 await expect(page.locator('canvas')).toBeVisible();
 await expect(page.locator('.section-heading h1')).toHaveText('Travel Earth');
 await expect(page.locator('.city-label')).toHaveCount(0);
 // No projected Moon label can cover Earth or intercept a stationary pointer.
 await expect(page.locator('.planet-label-anchor')).toHaveCount(0);
 await expect(page.getByRole('complementary',{name:'Explore content'})).toHaveCount(0);
 await expect(page.locator('.year-control')).toHaveCount(0);
 await expect(page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Timeline'})).toHaveCount(0);
});
