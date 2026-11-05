# MVP 验证记录

- TypeScript 严格检查通过；Next.js 静态导出通过，产物为 `out/`。
- 数据：46 个天体节点、7 篇公开示例故事、3 个地点、4 次示例旅行。
- 数据测试覆盖日期精度与区间、经纬度纹理坐标、超过三层的知识结构、循环和引用校验、非公开内容阻断、城市旋转到地球正面。
- 原始 MVP 曾完成桌面与手机浏览器检查；太阳系首页版本的完整图形回归仍需在本地复核，不能沿用旧版的通过结论。
- 本次浏览器使用 Chromium 软件渲染，不据此宣称真实 GPU 的帧率表现。实机性能、不同手机 GPU 和完整高级特效仍需后续迭代。
- 开发范围仅 `personal-blog`；未修改 `jp-sns-mvp` 文件、Docker、数据库或服务配置，也未执行其服务重启。
- 没有线上部署。所有故事和旅行仍为显式标注的演示内容。

截图：`preview-desktop.png`、`preview-earth.png`、`preview-mobile.png`、`preview-mobile-story.png`。

## 太阳系首页调整

- 顶部导航、左侧介绍和装饰文字默认隐藏，菜单按钮与 H 键可恢复。
- 新增太阳与天王星；知识载体改为地球的月球，旧 `knowledge` ID 保持可用。
- 八大行星与外围矮行星分别使用开普勒椭圆；月球的位置叠加在地球的日心位置之上。
- 轨道与天体使用同一条椭圆计算路径；太阳位于焦点，公转周期保持相对关系；物理轨道与逻辑内容层级分开建模。
- 新增开普勒求解、近日点/远日点、周期闭合、行星顺序、月球父级和横竖屏投影取景测试，合计 9 项数据与数学测试。
- 装饰轨道线不参与射线遮挡，避免影响城市标签；太阳系模式按太阳方向计算星球明暗。
- 质量设置同时控制噪声采样层数，减少轻量/标准模式的渲染开销。
- 测试预览独立使用 3101，不接管现有 3100 服务。

## OOM 后的验证范围与资源保护

之前桌面长流程浏览器回归超时，地球城市标签的图形回归未通过；随后系统日志确认 VS Code 扩展宿主遭遇 OOM。当前太阳系版本不能标记为完整浏览器回归已通过。手机与静态阅读检查曾通过，最终图形交互需在本地浏览器复核。

停止在该服务器运行 Chromium 软件渲染。未发现遗留的重型测试进程，保留现有 3100 静态预览和全部现有应用服务。

新增单进程数据测试入口，11 项测试覆盖月球知识导航与语言故事、轨道数学、投影取景，以及装饰轨道线不参与标签射线遮挡。新增检查资源保护器：单核、低优先级、单构建 worker、384 MiB Node 堆上限、640 MiB 进程组 RSS 采样预算，每 2 秒检查内存和负载并在阈值触发时终止本次任务。

### 受控构建结果

11 项轻量测试通过，包含月球 → 语言 → 日语故事的状态与内容关联，以及真实 Three.js 射线下轨道装饰线不会遮挡标签的检查。类型检查通过。静态生产构建通过，使用 1 个页面 worker；采样进程组 RSS 峰值 469 MiB，构建期间最低可用系统内存 1087 MiB。未触发保护阈值。当前未重新运行服务器上的图形浏览器回归。

## 入场镜头更新（已完成受控构建）

加入完整太阳系 → 停留 → 木星/土星轨道近景 → 界面淡入的镜头流程。完成状态与手动显示状态统一由 Zustand 管理，支持减少动态效果、Esc 跳过、天体直达、导航中断和错误降级。

新增取景投影与状态切换测试，并更新本地 Playwright 用例。窗口重载后可用内存恢复至约 1 GiB，13 项轻量测试、TypeScript 检查、数据校验及静态生产构建全部通过。构建采样进程组 RSS 峰值 467 MiB，最低可用系统内存 748 MiB，未触发保护阈值。out/ 已包含入场镜头更新。未启动服务器图形浏览器测试，视觉和交互效果仍需在用户浏览器复核。

## Canvas 备用内容误触发修复

已确认 R3F Canvas 将 fallback 作为原生 canvas 的子内容正常挂载；原 CanvasUnavailable 的 effect 因此会在 WebGL 正常时也触发失败状态。移除该组件，改用无副作用的备用文字，保留场景异常边界和 webglcontextlost 处理。13 项轻量测试、数据校验、生产构建（含 TypeScript）通过；构建采样 RSS 峰值 477 MiB，最低可用内存 673 MiB。Playwright 入场用例新增界面显示后 canvas 仍存在且未进入备用界面的断言，因服务器资源限制未执行浏览器回归。

## 星球独立页面与探索近景（已完成构建）

新增 11 个静态星球页面、太阳自我介绍结构、首页星球跳转和小天体点击区域。开始探索保持太阳系，镜头距离变为入场终点的 50%。新增 2 项轻量测试（预计共 15 项）与本地 Playwright 页面导航用例。语法转换通过；系统可用内存约 760 MiB，低于 1000 MiB 启动阈值，npm test 已被保护器拦截，未执行本次类型检查及构建。3100 的 out/ 仍为前一版。未修改 jp-sns-mvp 或启动浏览器测试。

## 首页星球点击与悬停修复

窗口重载后资源恢复，16 项轻量测试、独立 TypeScript 检查、数据验证及静态构建均通过，包含之前等待验证的 11 个星球页面。修复隐藏 Html 标签外层接收事件的问题，标签容器透传鼠标，使用画布边界及 client 坐标计算射线，避免事件目标改变后坐标偏移。交互集中到星球 group，扩大太阳系天体命中区域；悬停显示光环、名称、简介和手型光标，太阳系标签使用固定屏幕字号。新增鼠标坐标测试及本地 Playwright 中心太阳悬停和直接点击用例。构建采样 RSS 峰值 478 MiB，最低可用内存 1260 MiB。未在服务器运行浏览器回归，真实 hover/click 仍需用户浏览器复核。

## 地球、太阳与情绪世界页面调整（源码已保存，构建待内存恢复）

地球独立 URL 改为直接呈现现有 EarthSystem 旅行地球；情绪星球独立 URL 呈现情绪世界、选中对应星球内容，世界内点击星球保留情绪总览。太阳独立 URL 使用同一宇宙界面，左侧半径 1.85 的太阳与光晕，右侧自我介绍，竖屏调整镜头距离保证太阳可见。真实个人介绍继续保留待填写提示。更新本地 Playwright 页面预期。语法转换通过；npm test 被约 880 MiB 的可用内存拦截，未执行本次类型检查、构建或服务器浏览器回归。out/ 暂未包含此次更新。

## 入场取消等待（已构建）

ENTRY_PAUSE_SECONDS 从 0.8 改为 0，场景就绪后立即启动原有 2.2 秒镜头推进。16 项轻量测试、数据校验、生产构建及其 TypeScript 检查通过。构建采样 RSS 峰值 464 MiB，最低可用内存 1360 MiB；out/ 同时包含上一节的地球、太阳及情绪世界布局。未运行服务器浏览器测试。

## 英文文案与界面精简（源码更新，交由用户验证）

首页改为 Welcome to my universe. / I’m Jiahong Chen.；全站界面、星球数据、知识树、旅行与示例故事、无障碍标签及元数据统一为英文，HTML lang=en。移除首页脚注、装饰性坐标、好奇心标注、TIME COORDINATE 文本、场景页脚与 A MAP OF MY UNIVERSE 以下的全部目录；阅读页页脚一并移除。导航的 About Me 紧邻 Explore，直接进入太阳页并可重新打开介绍。太阳半径从 1.85 调整为 1.25，右侧介绍卡片桌面端宽度 54vw，手机保留底部卡片。修正文案重复展示，并同步更新现有测试选择器与日期断言。仅做源码阅读及文本扫描，按用户要求未运行 npm test、类型检查、构建、浏览器或启动服务；out/ 未更新。

## Lunar bases and floor plans — source update only

- Replaced orbiting knowledge children with a radius-3.8 Moon, two surface beacons, accessible landing buttons and responsive close framing. The Moon surface remains stationary while camera orbit is available.
- `/planets/knowledge/`, the Knowledge navigation item and existing deep links share one explorer. All descendants of knowledge bypass the old orbit/planet renderer and right-hand story directory.
- Base selection immediately opens a detailed SVG floor plan. Technology has five chambers; Languages has four. Chambers lead to workstations and nested stations; public notes open centrally with focus trapping, Escape handling and focus restoration.
- Added breadcrumbs, level-by-level return, Quick Find, surface field-note access and mobile floor-plan scrolling. Internal scenes use demand rendering; no new textures, dependencies, server processes or services.
- Updated existing browser test definitions and added lunar navigation tests. Per user instruction, no tests, type checks, compilation, build, browser or preview commands were run. Output in out/ is unchanged. Visual appearance and runtime behaviour await manual verification.

## Floating facilities and lunar relief — source update only

Removed the enclosing facility deck card/background and kept individual chambers floating over the star field. Added cached 512×256 / 1024×512 RGBA lunar surface maps (albedo + relief), spherical crater placement and shader normal perturbation for crater walls, rims and basin contrast; close-up Moon tessellation is increased. Lunar lighting follows the scene light direction when the camera orbits. No remote texture requests or dependencies.

Added two surface-aligned 3D facilities with independent building/panel details, visible infrastructure, communications equipment, landing pads, clickable geometry, hover outlines and compact identifying labels. Cursor resets on facility unmount. Existing floor-plan and workbench navigation is unchanged.

Only source inspection was performed. Tests, type checking, shader compilation, browser rendering, build and preview were not run, as requested by the user. Appearance, GPU shader compatibility and picking await manual verification; out/ is unchanged. jp-sns-mvp is untouched.

## Compact facility overview — source update only

Removed the facility overview header and its status strip, moved Moon surface return inside the drawing, and cropped the SVG from y=77 so the first rooms at y=102 have one 25-unit grid cell of upper space. Updated HTML hit regions to the cropped SVG coordinates. The overview fits both available height and width using a sized layout container, with a viewport fallback; mobile uses compact labels. Moon landing title is now My Knowledge & Skills with a plain-language introduction. Existing browser selectors were updated without execution. No tests, type checks, builds, preview or browser commands were run; out/ remains unchanged.

## My Works fleet — source update only

Added three detailed code-native vessels to the solar map and a dedicated works scene: flagship, research vessel, communications vessel. Selectable geometry and HTML labels route to a portfolio introduction or one of two clearly unfilled project slots. Bounded drift supports reduced motion, decorative lights use basic materials, and high-detail greebles are omitted on low quality. Added a static /works/ entry, validated ship query selection, accessible project dock, search entries, navigation ordering and responsive camera/panel layout. Works state is kept outside the physical planet/content tree, leaving orbital and lunar relationships intact.

Added state/data test definitions and browser test definitions for overview entry, project switching, mobile and navigation order. No tests, type checks, compilation, browser, build or preview commands were run. Source was inspected only. out/ remains unchanged and runtime/visual verification is left to the user. jp-sns-mvp is untouched.

## Unlabelled solar fleet and vessel surface finish — source update only

Removed overview fleet HTML labels entirely; ship geometry still handles hover and selection. The fleet detail scene retains vessel labels/dock. Added cached procedural paint and packed bump/roughness/metalness maps, per-face hull UVs, panel seams/fasteners, maintenance grilles, serial stencils, small wear marks, textured solar cells, service hatches, louvres, window mullions and instanced bolts. Main hull hover emission was reduced to retain texture contrast. The same Fleet renderer/materials serve both the solar overview and the dedicated works scene.

Updated the existing browser entry test definition for the absence of overview labels. No tests, type checks, build, browser or preview were run; only source inspection. GPU/material appearance, geometry picking and rendering await user verification. out/ is unchanged, and jp-sns-mvp was not modified.

## Collective solar icon and complete project fleet — source update only

Expanded works data to eight vessels total (flagship + six IT projects + one language project) using the user-provided project descriptions. Added period, role, stack, results, URLs and availability notes, preserving paused-booking and in-progress-Django status. Ship label titles match project titles. Solar rendering uses only three representative models as one selectable, hoverable group; all three highlight together and its sole entry opens /works/. Extra models render only in the works view. Hull families and texture caches are shared rather than generated per project.

Extracted the long About Me JSX into AboutProfile.tsx after a reported Cannot find name section editor diagnostic. The saved source had no parse diagnostics before extraction; all six edited TS/TSX implementation files were parsed individually after edits, with zero syntax diagnostics. This does not establish that the editor semantic diagnostic has cleared. No tests, full type checks, build or services were run. Existing test definitions were updated without execution. Runtime/visual and IDE confirmation remain manual. out/ and jp-sns-mvp are unchanged.
