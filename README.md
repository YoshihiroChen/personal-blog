# My Universe — 我的人生宇宙

独立的纯前端 3D 人生宇宙 MVP，项目目录为 `/home/chenjiahong/personal-blog`。

## 本地运行

```bash
cd /home/chenjiahong/personal-blog
npm ci
npm run dev
```

访问 `http://localhost:3100`。通过 VS Code Remote SSH 开发时，在「端口」面板转发 **3100**。项目使用独立依赖、独立锁文件和端口，不需要改动 `jp-sns-mvp`，不使用其 Docker、数据库或环境变量。

```bash
npm run typecheck
npm test
npm run build
# 启动静态预览后，可运行浏览器交互检查：npm run test:e2e
```

生产文件输出在 `out/`，可直接托管到 Cloudflare Pages；构建命令 `npm run build`，输出目录 `out`，建议使用 Node.js 22。无需常驻 Next.js 服务，不使用 API、SSR、数据库或登录。`npm start` 在 3100 端口预览构建完成的静态生产产物。

## 当前功能

- Three.js / React Three Fiber 全屏星空、程序化星球、大气、星环、海洋与岩浆差异化 Shader。
- GSAP 平滑镜头，拖动旋转、滚轮/双指缩放、点击星球、Esc 中止镜头飞行。
- 数据驱动的递归知识结构：地球 → 月球（知识）→ IT → 前端 → React → Next.js；只渲染当前系统及其直接子节点。
- 水星、火星、金星、木星、土星、海王星与未来冥王星的基础视觉主题。
- 单颗地球，NASA 日间与夜间纹理、程序化云、大气、三处示例坐标和城市聚焦；地点与多次到访分离。
- 故事面板、关联星球、上一篇/下一篇、年份过滤、未来节点暗化。
- 全站天体搜索（Ctrl/Cmd + K）、面包屑、Alt + ← 返回、画质设置、减少动态效果、手动开启的合成环境音、全屏。
- 手机底部内容抽屉、WebGL 失败替代入口，以及完全静态的 `/knowledge/`、`/travels/`、`/stories/`、`/stories/[id]/` 阅读页。
- `/?node=japanese` 等直接进入星球的分享链接。

## 编辑内容

- `src/data/universe.ts`：主题、天体节点和递归 children。`parentId` 自动从树生成，唯一 ID 使用小写英文与连字符；添加节点无需更改 3D 渲染组件。
- `src/data/stories.ts`：公开故事。`celestialNodeIds` 支持一篇故事关联多颗星球。
- `src/data/travels.ts`：地点和访问记录，照片放在 `public/images/` 后填写相对 URL 与替代文字。
- `src/types/universe.ts`：完整数据类型。日期明确区分 year / month / day / unknown，区间可添加 `end`。
- `src/shaders/planet.ts`：地表、海洋、岩浆与大气 Shader。
- `docs/design-v2.md`：原始完整设计书。
- `docs/assets.md`：地球素材来源和署名。

**所有人生故事、日期、语言经历与旅行地点均为示例，未假设用户的真实经历或证书。** 确认后再替换。

## 公开内容边界

`src/data/` 中只允许公开内容；构建校验遇到 private / draft 会直接失败。私人草稿请保存在项目目录之外，不能放入 `src`、`public` 或其他会随网站发布的文件。构建期校验检查 ID、父子关系、循环、主题、关联引用、日期、经纬度和静态素材路径。

## 迭代范围

本版本完成首轮 MVP 和数据架构，尚未宣称实现设计书全部高级效果。后续可继续迭代海面下潜叙事、地表自由体验、精细云层阴影、火山粒子、Bloom/景深、KTX2/LOD 与纹理分级、真实照片、MDX 长文和正式域名部署。当前画质等级控制星点数、球体细分、大气和 DPR；移动端默认轻量。桌面 60 FPS 是后续实机测量目标，不作为已验证的所有设备性能保证。

部署前替换示例资料、确认真实内容公开意愿与素材许可，绑定真实域名后可增加 canonical 和 sitemap。此轮没有创建任何线上部署。

## 首页太阳系更新

首页默认隐藏顶部导航、左侧介绍和装饰性文字。右上角小菜单或 `H` 键可显示/隐藏；搜索仍支持 Ctrl/Cmd + K，内容目录保留在首屏下方。

太阳位于原点，水星、金星、地球、火星、木星、土星、天王星、海王星各自沿椭圆轨道公转。冥王星以矮行星身份保留在倾斜较大的外围轨道上。月球绕地球运行，承载原来的「知识与成长」，原 `knowledge` 链接及故事关联保持可用。

轨道数据在 `src/data/solar-system.ts`，计算在 `src/lib/orbits.ts`。采用 NASA/JPL J2000 近似轨道参数，求解开普勒方程，保留偏心率、倾角、绕行方向和公转周期的相对关系。数据来源：https://ssd.jpl.nasa.gov/planets/approx_pos.html ，月球平均轨道参数参考 https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html 。动画约每秒推进 3 个模拟日；初始相位为示意，不代表当前日期的实时星历。

为了同时看清内外行星，**轨道距离和天体大小分别缩放**，不是等比例天文模拟。故事年份筛选不用于计算真实星历。开启减少动态效果时暂停公转与自转。月球的天体 ID 仍为 `knowledge`，逻辑路径现在为地球 → 月球 → 语言 / IT，不会丢失已有内容。

预览默认仍为 3100；如需独立测试，可使用 `PORT=3101 npm start`。浏览器测试支持 `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3101 npm run test:e2e`。

## 低资源服务器运行约束

本服务器为 2 核 / 4 GB；日常查看使用 `npm start` 静态预览。测试与构建串行执行，`npm test`、`npm run typecheck`、`npm run validate`、`npm run build`、`npm run dev` 均经过资源保护器。

- Linux 下固定到一个允许的 CPU 核心，以 nice 15 的较低优先级执行，Next.js 页面构建 worker 降为 1。
- Node.js 堆上限 384 MiB；每个检查进程组采样 RSS 预算 640 MiB。
- 开始时至少需要 1000 MiB 可用内存；运行时每 2 秒检查，系统可用内存低于 600 MiB、进程组超预算或一分钟 CPU 负载超过核心数的两倍时，终止本次任务。
- 保护器只管理自己启动的任务，不终止 VS Code、现有应用或预览服务。资源采样不能保证捕获所有瞬间峰值，仍应保持串行操作。
- 低于 6 GB 内存的 Linux 服务器会拒绝 `npm run test:e2e`。3D 浏览器回归放到本地电脑执行；服务器只进行轻量数据、数学、类型和受控构建检查。

这些阈值用于保护当前小内存服务器。监测在相关命令运行期间生效，不代表已经安装全天候监控服务。

## 电影式入场

打开首页后先展示太阳系较近的远景（完整取景距离的 80%），场景就绪后立即用 2.2 秒推进到更紧的近景（以土星轨道取景距离的 70% 为终点），进一步放大星球与轨道；抵达后导航、左侧介绍和其他界面一起淡入。每次页面加载只播放一次，返回首页使用最终近景。

`Esc` 跳过开场，菜单或 `H` 键仍可手动控制界面。开启减少动态效果时直接进入近景并显示界面；天体直达链接跳过开场。WebGL 失败时恢复 HTML 导航，避免停在隐藏界面。

时长与取景参数：`src/lib/entry.ts`；镜头动画：`src/components/universe/Scene.tsx`。镜头结束回调控制界面显示，不使用与相机脱节的独立显示计时器。

### 星球页面与开始探索

首页点击「开始探索」后保持太阳系视图，镜头从入场终点再靠近 50%，收起左侧介绍，让位给星球选择。太阳、八大行星、冥王星与月球的实体和名称均可点击，前往 `/planets/[id]/` 独立页面。页面支持静态导出、刷新与分享；太阳 `/planets/sun/` 是自我介绍入口，真实简介和联系方式尚待填写。月球继续链接知识档案，地球继续链接旅行档案。首页下方增加星球目录，方便触屏和键盘访问，也可以找到近景画面之外的星球。

星球页面最新布局：`/planets/earth/` 直接显示旅行地球三维场景；情绪星球 URL 显示情绪世界及对应档案；`/planets/sun/` 左侧显示较小太阳，右侧为自我介绍。月球保留知识阅读页。

### 当前界面文案与验证方式

界面及示例内容已统一英文；首页采用 Welcome to my universe. / I’m Jiahong Chen.，移除装饰脚注、页脚及下方目录。Explore 右侧为 About Me，太阳页左侧使用较小太阳、右侧介绍卡片占桌面视口 54%。测试、构建、预览均由用户手动执行，代理修改代码后不自动运行这些命令。

### Lunar Knowledge Explorer

Knowledge now opens a large Moon with two landing sites, Technology and Languages. `/planets/knowledge/` and the Knowledge navigation item both open the same lunar surface. Choosing a base directly opens a detailed top-down facility plan: Technology has Frontend, Backend, Cloud, Databases and AI chambers; Languages has four communications chambers. Chambers lead to workstations, including React → Next.js. Public field notes open in a central reading dialog. Breadcrumbs, Step back and Quick Find support direct navigation, including existing `?node=...` links. Moon field notes and the standalone `/knowledge/` text archive remain available.

The Moon has no orbiting content planets. The facility uses lightweight SVG/HTML and the background switches to demand rendering indoors. Mobile supports scrolling within the floor plan. Code and test definitions are saved; tests, type checking, build and preview are left for the user to run manually.

### Lunar surface detail and floating floor plans

Facility plans now float directly over the star field, with no enclosing card, border or opaque deck background. The Moon uses a locally generated, cached regolith/relief texture: broad dark maria, hundreds of crater bowls, raised rims and occasional central peaks. Relief gradients perturb the lighting normals, with reduced edge glow and closer-view geometry detail. This is an artistic procedural surface rather than a geographic lunar survey. No remote image download or new dependency is required.

Both landing sites now have three-dimensional facilities aligned to the lunar surface: terraced foundations, habitats, solar arrays, observation domes, antennas, airlocks and landing pads. The Languages base includes a communications dish. Models and labels both enter their respective base; hovering highlights the landing area. Per user preference, changes are saved without running tests, builds or services.

The lunar landing page is titled **My Knowledge & Skills**. Facility overviews omit the large title/description block, place the Moon surface return button inside the plan, and fit the full facility to the available width and height. The drawing starts one grid cell above the first chamber row; mobile uses compact room labels rather than requiring a horizontal pan. Workstation pages retain their individual headings.

### My Works / Expedition fleet

The solar map now includes three independently selectable vessels in a bounded formation: a flagship for My Works, a research vessel for one IT project, and a communications vessel for one language project. Models use bevelled hulls, bridge decks, engines, lit windows, solar/radiator wings, research pods and a communications dish. No external model, texture or new dependency is required. The fleet drifts gently; reduced motion stops the drift.

The My Works navigation item sits after Knowledge; Travel Earth now precedes Inner Worlds. `/works/` opens the flagship introduction; `/works/?ship=research` and `/works/?ship=communications` select a project slot directly. Clicking a ship in the overview enters the fleet scene and displays its content. A dock provides keyboard/touch selection, and search includes all three vessels. Existing planetary orbital data and knowledge hierarchy are unchanged. Actual project names, dates, technologies and links await user-provided details; the two slots explicitly say DETAILS COMING SOON.

Code and test definitions are saved. Tests, type checks, builds and preview remain manual, as requested.

### Fleet finish refinement

Solar overview vessels no longer render any HTML explanation/name boxes; geometry hover and direct clicks remain, with My Works navigation available for keyboard access. The dedicated fleet scene retains its identifying controls. Both views use the same upgraded ship components and cached surface maps: armour seams, plate variation, recessed service covers, cooling slots, fasteners, subtle wear, hull serial stencils and individually patterned solar cells. Hull UVs are projected per face; packed relief/roughness/metalness maps provide lighting detail. Rivets are instanced, and low quality uses 256px maps and fewer small fittings (standard uses 512px). No external textures or dependencies were added. Manual verification is still required.

### Expanded project fleet

My Works now contains one flagship and seven project vessels: six IT projects (Rails job-hunting support, Next.js frontend learning platform, Next.js/FastAPI IT learning and bootcamp, Django financial service, RAG study assistant, distributed career-consultation booking) and the Japanese essay experience. Hover labels and selectors use project titles, with availability and project links in the details. The booking service is explicitly paused for hosting costs; Django is marked MVP in development.

The solar map retains only the original three models as one interactive fleet icon: collective hover/glow/scale and a single My Works label/entry. Additional ships exist only in the works scene. Project models reuse the three existing hull/material families, with wider formation framing and a scrollable selection dock. About Me content was extracted into AboutProfile.tsx to simplify the main app JSX; existing personal content, including the user-edited School of International Studies name, is preserved.
