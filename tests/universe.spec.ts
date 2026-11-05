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
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Travel Earth'}).click();await panel.getByRole('button',{name:/Tokyo/}).click();await expect(panel.getByRole('heading',{name:'Tokyo'})).toBeVisible();await expect(panel.getByRole('heading',{name:'Tokyo, Again'})).toBeVisible();await page.waitForTimeout(2500);await page.screenshot({path:'docs/preview-earth.png'});
 await page.locator('#year-slider').fill('2024');await expect(panel.getByRole('heading',{name:'Tokyo, Again'})).not.toBeVisible();
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Timeline'}).click();await expect(page.locator('.timeline-stories')).not.toContainText('The Pull of a City');
 await page.getByRole('button',{name:'Visual settings'}).click();await page.getByRole('button',{name:'Low'}).click();await expect(page.getByRole('switch')).toHaveAttribute('aria-checked','true');
 expect(errors).toEqual([]);
});
test('static reading pages work without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 for(const path of ['/knowledge/','/travels/','/stories/','/stories/adrift/']){const response=await page.goto(path);expect(response?.status()).toBe(200);await expect(page.getByRole('heading',{level:1})).toBeVisible();}
 await context.close();
});
test('mobile has no horizontal overflow and supports a bottom story drawer',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await page.waitForTimeout(2000);await page.screenshot({path:'docs/preview-mobile.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Inner Worlds'}).click();await page.getByRole('button',{name:'Mercury · Adrift Uncertainty · Discovery'}).click();
 const panel=page.getByRole('complementary',{name:'Explore content'});await expect(panel).toBeVisible();await panel.getByRole('button',{name:/A Little While at Sea/}).click();await expect(panel.getByRole('heading',{name:'A Little While at Sea'})).toBeVisible();await page.screenshot({path:'docs/preview-mobile-story.png'});
});
test('reduced motion keeps city labels aligned with the rotated earth',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/?node=earth');
 const panel=page.getByRole('complementary',{name:'Explore content'});
 await panel.getByRole('button',{name:/Tokyo/}).click();
 const label=page.locator('.city-label').filter({hasText:'Tokyo'});
 await expect(label).toBeVisible({timeout:60000});
 await expect.poll(async()=>{const box=await label.boundingBox();return box!==null&&box.y>400&&box.y<650;},{timeout:30000}).toBe(true);
 await page.screenshot({path:'docs/preview-earth.png'});
});
