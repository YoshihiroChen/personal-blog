import { test,expect } from '@playwright/test';
test('moon knowledge keeps language stories accessible',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/?node=knowledge');
 const panel=page.getByRole('complementary',{name:'探索内容'});
 await expect(panel.getByRole('heading',{name:'月球 · 知识与成长'})).toBeVisible();
 await panel.getByRole('button',{name:/语言星球/}).click({timeout:30000});
 await panel.getByRole('button',{name:/日语 Japanese/}).click({timeout:30000});
 await panel.getByRole('button',{name:/用另一种语言，看见世界/}).click({timeout:30000});
 await expect(panel.getByText('学习一门语言，也是在学习另一种观察世界的方式。',{exact:false})).toBeVisible();
 expect(errors).toEqual([]);
});
