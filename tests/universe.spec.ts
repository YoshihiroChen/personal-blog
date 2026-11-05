import { test,expect } from '@playwright/test';
test('desktop WebGL, recursive navigation, stories, travel, search and settings',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.getByRole('navigation',{name:'主导航'})).toBeVisible();
 await expect(page.locator('.hero')).toBeVisible();
 await expect(page.locator('canvas')).toBeVisible();
 await expect(page.locator('.planet-label')).toHaveCount(11,{timeout:60000});
 await page.waitForTimeout(2500);await page.screenshot({path:'docs/preview-desktop.png'});
 await expect(page.getByRole('navigation',{name:'主导航'})).toBeVisible();
 await page.getByRole('button',{name:'画质与动态设置'}).click();await page.getByRole('button',{name:'轻量'}).click();await expect(page.getByRole('switch',{name:/减少动态效果/})).toHaveAttribute('aria-checked','true');await page.getByRole('button',{name:'关闭设置'}).click();
 await page.getByRole('button',{name:'开始探索'}).click();
 const panel=page.getByRole('complementary',{name:'探索内容'});await expect(panel.getByRole('heading',{name:'月球 · 知识与成长'})).toBeVisible();
 await panel.getByRole('button',{name:/语言星球/}).click();await panel.getByRole('button',{name:/日语 Japanese/}).click();
 await panel.getByRole('button',{name:/用另一种语言，看见世界/}).click();await expect(panel.getByText('学习一门语言，也是在学习另一种观察世界的方式。',{exact:false})).toBeVisible();
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'搜索天体',exact:true}).click();await page.getByRole('textbox',{name:'搜索天体名称'}).fill('Next.js');await page.getByRole('dialog',{name:'搜索宇宙'}).getByRole('button',{name:/Next.js/}).click();
 await expect(panel.getByRole('heading',{name:'Next.js Next.js'})).toBeVisible();await expect(page.locator('.breadcrumbs')).toContainText('React');
 await page.getByRole('navigation',{name:'主导航'}).getByRole('button',{name:'旅行地球'}).click();await panel.getByRole('button',{name:/东京/}).click();await expect(panel.getByRole('heading',{name:'东京 Tokyo'})).toBeVisible();await expect(panel.getByRole('heading',{name:'再一次，与东京相遇'})).toBeVisible();await page.waitForTimeout(2500);await page.screenshot({path:'docs/preview-earth.png'});
 await page.locator('#year-slider').fill('2024');await expect(panel.getByRole('heading',{name:'再一次，与东京相遇'})).not.toBeVisible();
 await page.getByRole('navigation',{name:'主导航'}).getByRole('button',{name:'时间轨迹'}).click();await expect(page.locator('.timeline-stories')).not.toContainText('城市的另一种引力');
 await page.getByRole('button',{name:'画质与动态设置'}).click();await page.getByRole('button',{name:'轻量'}).click();await expect(page.getByRole('switch')).toHaveAttribute('aria-checked','true');
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
 await page.getByRole('navigation',{name:'主导航'}).getByRole('button',{name:'情绪世界'}).click();await page.getByRole('button',{name:'水星 · 迷茫之海 迷茫 · 寻找'}).click();
 const panel=page.getByRole('complementary',{name:'探索内容'});await expect(panel).toBeVisible();await panel.getByRole('button',{name:/在没有方向的海上/}).click();await expect(panel.getByRole('heading',{name:'在没有方向的海上'})).toBeVisible();await page.screenshot({path:'docs/preview-mobile-story.png'});
});
test('reduced motion keeps city labels aligned with the rotated earth',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/?node=earth');
 const panel=page.getByRole('complementary',{name:'探索内容'});
 await panel.getByRole('button',{name:/东京/}).click();
 const label=page.locator('.city-label').filter({hasText:'Tokyo'});
 await expect(label).toBeVisible({timeout:60000});
 await expect.poll(async()=>{const box=await label.boundingBox();return box!==null&&box.y>400&&box.y<650;},{timeout:30000}).toBe(true);
 await page.screenshot({path:'docs/preview-earth.png'});
});
