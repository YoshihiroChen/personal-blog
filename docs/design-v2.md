# My Universe — 我的人生宇宙
## 电影级沉浸式 3D 人生宇宙网站技术设计书

**版本：** V2.0  
**项目类型：** 纯前端 3D Web Application  
**设计方向：** Cinematic Realism / Interactive Universe / Personal Storytelling  
**技术架构：** Next.js + TypeScript + Three.js + React Three Fiber  
**数据存储：** 静态 JSON / TypeScript / MDX  
**生产部署：** Cloudflare Pages（首选）  
**数据库：** 不使用  
**后端 API：** 不使用

---

# 第一章 项目概述

## 1.1 项目定位

My Universe 是一个电影级、沉浸式、可交互的个人宇宙网站。

它不是传统的个人博客、简历网站或者作品集，而是通过一个具有真实宇宙视觉效果的 3D 世界，展示个人的经历、知识、情绪、成长和旅行足迹。

整个网站以宇宙作为视觉载体。

不同星球具有不同的象征意义。

用户可以自由探索星系、星球、卫星以及地球上的地点，逐步了解网站主人的人生故事。

网站需要同时具备以下特征：

1. 电影级真实宇宙视觉效果。
2. 可自由探索的 3D 星空。
3. 支持自定义星系、星球和卫星。
4. 支持无限逻辑层级的天体组织结构。
5. 支持情绪主题星球。
6. 支持人生经历和时间轴。
7. 支持知识领域的层级展示。
8. 支持交互式 3D 地球旅行地图。
9. 支持桌面端和移动端。
10. 采用纯前端架构，支持静态部署。

## 1.2 核心设计理念

项目由三个相互关联的系统组成。

### A. Knowledge Universe — 知识宇宙

用于展示个人的学习经历、专业技能、知识领域和技术成长。

例如：

学习星球
- 语言星球
  - 汉语卫星
  - 英语卫星
  - 日语卫星
  - 德语卫星
- IT 星球
  - 前端技术卫星
  - 后端技术卫星
  - 云计算卫星
  - 数据库卫星
  - AI 技术卫星

每个天体都可以进一步细分。

例如：

IT 星球 → 前端技术卫星 → React 子天体 → Next.js 子天体。

这里的“星球”“卫星”是视觉身份，不是数据层级限制。

系统内部统一使用 CelestialNode（天体节点）表示所有可探索对象。

### B. Emotional Universe — 情绪宇宙

用于表达不同时期的心理状态、感受和人生故事。

例如：

水星：迷茫、窒息、寻找方向。

火星：焦躁、愤怒、压力。

金星：温暖、幸福、爱。

木星：成长、突破、野心。

海王星：孤独、沉默、疏离。

每颗情绪星球都拥有独立的自然环境、材质、光照、动画和声音设计。

### C. Travel Earth — 旅行地球

旅行不再使用单独的星系。

整个旅行模块只使用一颗地球。

地球使用尽可能真实的地表纹理、云层、大气效果和昼夜光照。

用户可以旋转地球、缩放视角、点击地点标记，查看曾经去过的国家、城市和旅行故事。

旅行地点属于地球内部的数据，不需要为每个城市创建独立星球。

---

# 第二章 宇宙整体信息架构

## 2.1 顶层结构

整个网站包含以下主要入口：

My Universe
- 宇宙首页
- 知识与成长
- 情绪与人生
- 旅行地球
- 时间轨迹
- 关于我

这些入口不必对应互相隔离的独立页面。

推荐使用同一个 3D 宇宙场景，通过相机移动和内容筛选完成不同模块之间的切换。

例如：

点击“知识与成长”，镜头飞向知识星球所在的区域。

点击“情绪与人生”，镜头转向情绪星球群。

点击“旅行地球”，镜头飞向地球。

点击“时间轨迹”，显示所有经历的时间关系。

## 2.2 自定义星系系统

用户可以通过修改配置文件，添加新的星系、星球、卫星和子天体。

例如：

自定义星系 A
- 星球 A1
  - 卫星 A1-1
  - 卫星 A1-2
- 星球 A2
  - 卫星 A2-1

自定义星系 B
- 星球 B1
  - 卫星 B1-1
    - 子天体 B1-1-1

系统不得将层级固定为三层。

数据结构需要支持递归。

每个节点至少包含：

- id：唯一标识符
- parentId：父节点 ID
- type：天体类型
- name：显示名称
- description：简介
- theme：视觉主题
- contentId：关联内容
- children：子节点
- orbit：轨道参数
- visual：视觉参数

节点类型包括：

- galaxy
- star
- planet
- moon
- celestial-body
- region

region 用于逻辑分组，不一定对应真实可见天体。

## 2.3 天体层级与视觉表达

为避免层级过深造成画面混乱，采用“逻辑层级无限、视觉层级按需加载”的设计。

例如：

当用户处于知识星球外部时，只看到知识星球。

点击知识星球后，进入其局部天体系统，显示语言星球和 IT 星球。

点击语言星球后，进一步显示汉语、英语、日语、德语卫星。

点击 IT 星球后，显示前端、后端、云计算、数据库等技术卫星。

每个层级都有独立的相机范围和空间尺度。

用户可以通过返回按钮回到父级天体系统。

这样可以避免把几十甚至几百个天体同时渲染在同一画面中。

## 2.4 真实宇宙与象征宇宙的关系

本项目采用“视觉写实，结构象征”的原则。

星球的表面、光照、材质、大气、云层尽量接近真实宇宙的视觉表现。

但是天体之间的关系不必遵循真实天文学。

例如：

语言星球可以围绕学习星球运行。

英语卫星可以围绕语言星球运行。

一个名为“知识星球”的天体可以具有自己的局部星球系统。

这是一种叙事性的宇宙结构，而不是科学天文模拟器。

---

# 第三章 电影级视觉设计

## 3.1 总体视觉风格

视觉关键词：

- Cinematic
- Photorealistic
- Deep Space
- Atmospheric
- Mysterious
- Immersive
- Minimal UI

主要颜色：

- 宇宙背景：接近纯黑的深蓝色
- 遥远星云：暗紫色、深蓝色
- 恒星光照：白色、淡金色
- UI：低透明度深色玻璃材质
- 文字：柔和白色
- 交互高亮：淡蓝色或银白色

避免使用过度饱和的霓虹颜色。

## 3.2 星空背景

星空由三个层次构成。

第一层：遥远恒星背景。

使用高质量星空纹理或程序化星点。

第二层：中距离恒星。

使用 GPU 粒子或 InstancedMesh 渲染。

第三层：近距离星尘。

少量粒子随着镜头移动产生视差效果。

星云使用程序化 Shader、体积效果近似或者高质量纹理。

为了控制性能，默认不使用昂贵的全场景实时体积光线追踪。

## 3.3 星球渲染

星球基础结构：

Planet
- Surface Mesh
- Surface Material
- Cloud Layer
- Atmosphere Layer
- Night Layer
- Optional Rings
- Optional Particle Effects
- Interaction Collider

其中：

Surface Mesh 用于地表。

Cloud Layer 用于云层。

Atmosphere Layer 用于大气散射效果。

Night Layer 用于夜间灯光等特殊材质。

Rings 用于土星等带有星环的天体。

Particle Effects 用于火山灰、冰晶、星尘等。

## 3.4 光照系统

采用单一主恒星光源与必要的局部辅助光源。

主要光照效果：

- 恒星方向光
- 星球明暗交界
- 大气边缘散射
- 云层阴影
- 自发光岩浆
- 夜间城市灯光

后期处理：

- Bloom
- Tone Mapping
- Color Grading
- Selective Depth of Field
- Anti-aliasing

所有特效必须能够根据设备性能降级。

## 3.5 镜头语言

镜头运动参考电影摄影。

镜头状态包括：

1. Universe Overview
2. Galaxy Focus
3. Planet Orbit
4. Planet Approach
5. Surface Experience
6. Story Focus
7. Return Flight

镜头切换使用平滑插值或 GSAP 时间线。

避免突然跳转和强烈抖动。

镜头飞行需要具有加速、减速和惯性。

对于容易产生眩晕的用户，提供“减少动态效果”设置。

---

# 第四章 情绪星球设计

## 4.1 情绪星球的基本原则

每颗情绪星球具有五个核心属性：

1. 情绪主题
2. 自然环境
3. 视觉语言
4. 交互反馈
5. 人生故事

情绪不能仅通过文字表达。

应当通过环境变化、色彩、运动、声音和镜头来表达。

## 4.2 水星：迷茫之海

英文名称：The Drowned World

主题：

迷茫、窒息、失去方向。

环境：

整颗星球被深蓝色海洋覆盖。

海面存在缓慢移动的风暴和波浪。

大气层中存在浓厚云雾。

主要交互：

用户点击水星后，相机逐渐靠近海面。

进入故事场景时，镜头缓慢下潜。

随着深度增加，光线逐渐减弱。

故事内容随着下潜过程出现。

情绪演化：

迷茫时期，海洋黑暗且混乱。

随着人生经历变化，海面逐渐平静。

最终可以出现海底光源或远方的地平线。

技术实现：

- Custom Ocean Shader
- Animated Normal Maps
- Fresnel Reflection
- Depth Fog
- Underwater Color Grading

## 4.3 火星：焦躁之火

英文名称：The Burning World

主题：

焦躁、愤怒、压力、急切。

环境：

暗红色地表。

遍布岩浆裂缝。

局部火山喷发。

天空存在火山灰。

主要交互：

靠近星球时，可以听到低沉的环境音效。

岩浆缓慢脉动。

部分区域发生随机但可控的喷发动画。

情绪演化：

随着故事发展，岩浆活动逐渐减弱。

部分地表冷却。

技术实现：

- Lava Shader
- Emissive Material
- Noise Animation
- Particle System
- Heat Distortion

## 4.4 金星：温暖之境

主题：

幸福、温暖、爱。

环境：

柔和的云海。

金色日出。

粉色和橙色天空。

缓慢流动的云层。

交互：

镜头移动平缓。

背景光照柔和。

故事以温暖的照片和文字为主。

## 4.5 木星：成长之境

主题：

成长、突破、野心。

环境：

巨大的气态星球。

多层次云带。

不断变化的风暴。

交互：

相机可以围绕巨大风暴观察。

故事节点分布在不同的云层区域。

## 4.6 土星：探索之境

主题：

好奇、探索、求知。

环境：

巨大的冰晶星环。

不同大小的卫星。

遥远而神秘的光照。

交互：

用户可以沿着星环探索不同知识节点。

星环也可以作为知识关联的视觉象征。

## 4.7 海王星：孤独之境

主题：

孤独、沉默、疏离。

环境：

寒冷的蓝色星球。

极弱的恒星光照。

深蓝色风暴。

交互：

镜头运动缓慢。

声音空间感较强。

整体氛围安静、遥远。

## 4.8 冥王星：重生之境

主题：

结束、告别、重新开始。

环境：

冰封地表。

低温薄雾。

遥远的日出。

交互：

随着故事推进，部分冰层出现融化效果。

光线逐渐照亮地表。

## 4.9 情绪与经历的关系

情绪星球代表情绪类型。

具体经历以 Story 的形式保存。

一个情绪星球可以关联多个 Story。

一个 Story 也可以关联多个情绪标签。

例如：

2020 年的某段经历可以同时关联迷茫与焦躁。

它可以主要展示在水星，同时在火星中建立关联入口。

避免重复保存相同内容。

---

# 第五章 知识星球系统

## 5.1 知识系统的设计目标

知识系统用于展示个人学习领域、技能发展和学习成果。

它与情绪星球不同。

情绪星球强调环境与故事。

知识星球强调结构、关联和探索。

## 5.2 学习星球

学习星球是一个主要领域节点。

它可以拥有独立的视觉主题。

例如：

蓝色和银白色的地表。

象征知识网络的发光纹理。

围绕它运行的多个子天体。

## 5.3 语言星球

语言星球属于学习星球的子节点。

语言星球具有四颗主要卫星：

- 汉语卫星
- 英语卫星
- 日语卫星
- 德语卫星

每颗卫星可以展示：

- 学习历程
- 语言能力
- 考试与证书
- 学习笔记
- 文化体验
- 相关照片
- 重要时间节点

例如：

点击日语卫星后，镜头进入日语学习场景。

用户可以查看不同年份的学习经历和相关成果。

## 5.4 IT 星球

IT 星球用于展示技术能力和项目经历。

建议初始结构：

IT 星球
- Frontend
  - HTML
  - CSS
  - JavaScript
  - TypeScript
  - React
  - Next.js
  - Three.js
- Backend
  - Python
  - FastAPI
  - Ruby
  - Rails
  - Node.js
- Cloud
  - AWS
  - Docker
  - CI/CD
  - Linux
- Database
  - SQL
  - PostgreSQL
  - Redis
- AI
  - LLM
  - RAG
  - AI Agent

这些分类只是初始示例。

实际内容通过配置文件定义。

不应将任何技术名称写死在 3D 组件中。

## 5.5 技术节点的展示内容

每个技术节点可以包含：

- 技术简介
- 学习时间
- 熟练程度
- 相关项目
- 学习笔记
- GitHub 链接
- 外部参考链接
- 相关技术节点

例如：

点击 React 节点。

显示：

React
- 开始学习时间
- 核心概念
- 使用经验
- 项目列表
- 相关技术：Next.js、TypeScript

熟练程度属于用户自定义信息，不应自动根据节点大小推断。

## 5.6 自定义视觉主题

每个领域节点可以配置独立主题。

例如：

语言星球使用蓝色大气与温和光照。

IT 星球使用暗色地表与发光电路纹理。

云计算节点使用漂浮云层与光线。

AI 节点使用动态神经网络式纹理。

视觉主题由配置驱动。

同一个渲染组件可以根据不同参数生成不同星球。

---

# 第六章 旅行地球系统

## 6.1 设计原则

旅行模块只使用一颗地球。

不创建旅行星系。

地球代表真实世界中的旅行经历。

用户可以从宇宙总览中直接点击地球进入旅行模式。

## 6.2 地球视觉效果

地球应尽量接近真实卫星视角。

主要视觉元素：

- 高分辨率地表纹理
- 海洋
- 大气层
- 云层
- 昼夜交界
- 夜间城市灯光
- 缓慢自转

使用公开授权或商业许可允许的地球纹理。

需要保存素材来源和许可证信息。

## 6.3 旅行地点标记

每个旅行地点具有经纬度坐标。

数据包括：

- id
- country
- city
- name
- latitude
- longitude
- visitedAt
- description
- photos
- stories

例如：

Tokyo
- latitude: 35.6762
- longitude: 139.6503

Osaka
- latitude: 34.6937
- longitude: 135.5023

地点标记使用三维球面坐标定位。

从经纬度转换到地球模型表面的位置。

需要统一地球纹理的经度方向和模型坐标系，避免地点标记发生镜像或偏移。

## 6.4 旅行交互

用户点击地球后：

1. 相机飞向地球。
2. 地球逐渐放大。
3. 出现已访问地点的标记。
4. 用户可以旋转地球。
5. 点击地点标记。
6. 相机转向目标地点。
7. 显示旅行故事和照片。

地点标记使用微弱发光效果。

鼠标悬停时显示城市名称。

点击后显示完整信息。

## 6.5 旅行故事面板

例如：

Tokyo, Japan

旅行日期：2025 年

内容：

- 旅行照片
- 旅行日记
- 特别的经历
- 地点描述
- 相关人生故事

支持同一城市多次旅行。

因此地点和旅行记录应当分开建模。

一个地点可以关联多条 Visit 记录。

## 6.6 地球性能设计

地球纹理根据设备能力加载不同分辨率。

桌面端可以使用高分辨率材质。

移动端使用较低分辨率材质。

远距离观察时，不加载城市级细节。

旅行照片在打开地点面板后按需加载。

---

# 第七章 人生时间轴系统

## 7.1 目标

通过时间维度重新组织所有人生经历。

用户可以拖动时间轴，观察不同年份的宇宙状态。

## 7.2 时间轴行为

例如：

2018 年：

只显示当时已经发生的经历。

2022 年：

出现新的学习经历和情绪故事。

2026 年：

显示截至该年份的全部经历。

未来年份：

可以显示尚未实现的目标。

## 7.3 数据要求

所有 Story 使用标准化日期。

支持：

- 精确日期
- 年月
- 仅年份
- 时间区间
- 未确定日期

日期精度需要明确保存，不能把未知月份自动解释为一月。

## 7.4 星球状态

星球可以具有以下状态：

- locked
- discovered
- active
- completed
- future

这些状态用于视觉表达。

不应将人生经历简单地等同于游戏任务。

未来星球可以保持暗淡或半透明状态。

---

# 第八章 网站 UI 与交互

## 8.1 首页

首页采用全屏 3D Canvas。

主要元素：

左上角：
- 网站 Logo
- My Universe

顶部：
- 宇宙探索
- 知识与成长
- 情绪世界
- 旅行地球
- 时间轨迹
- 关于我

右上角：
- 音乐开关
- 画质设置
- 全屏按钮

底部：
- 当前所在位置
- 返回上一级
- 操作提示

## 8.2 星球悬停

鼠标悬停时：

- 星球边缘出现轻微高亮
- 显示名称
- 显示主题
- 显示简短描述

不要使用过强的发光效果破坏写实感。

## 8.3 星球点击

点击星球后：

- 禁用冲突的自由相机操作
- 开始镜头飞行
- 相机逐渐接近目标
- 加载局部细节
- 显示故事或子天体
- 恢复对应模式的交互

需要支持中途取消飞行。

## 8.4 故事面板

故事面板采用低透明度深色玻璃风格。

包含：

- 标题
- 时间
- 标签
- 正文
- 图片
- 关联节点
- 上一个故事
- 下一个故事
- 关闭按钮

面板尽量不遮挡主要星球。

桌面端可以采用右侧抽屉。

移动端采用底部抽屉。

## 8.5 导航体验

支持：

- 鼠标拖动
- 滚轮缩放
- 点击选择
- 返回父节点
- 返回宇宙首页
- 直接搜索天体
- 键盘操作
- 触摸手势

所有关键内容都必须能够通过普通 HTML 导航访问。

3D 场景不应成为访问网站内容的唯一方式。

---

# 第九章 前端技术架构

## 9.1 核心技术

推荐使用：

- Next.js
- React
- TypeScript
- Three.js
- React Three Fiber
- Drei
- GSAP
- Zustand
- Tailwind CSS
- MDX
- 自定义 GLSL Shader

## 9.2 Next.js 运行方式

使用 App Router。

采用静态导出模式：

```js
// next.config.mjs
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

生产构建后输出静态文件到 `out/`。

不使用：

- Server Actions
- 运行时 SSR
- 动态 API Routes
- 依赖服务器运行的功能
- 数据库访问

所有动态交互在浏览器中执行。

## 9.3 3D 场景架构

主要组件：

UniverseCanvas
- UniverseScene
  - Starfield
  - Nebula
  - LightingSystem
  - CelestialSystem
  - CameraController
  - InteractionManager
  - PostProcessing

CelestialSystem
- GalaxyRenderer
- PlanetRenderer
- MoonRenderer
- OrbitRenderer
- AtmosphereRenderer
- RingRenderer

特殊场景：

- OceanPlanetScene
- LavaPlanetScene
- EarthTravelScene
- KnowledgePlanetScene

## 9.4 状态管理

使用 Zustand。

核心状态：

- currentMode
- selectedNodeId
- focusedNodeId
- navigationPath
- cameraState
- activeStoryId
- selectedYear
- qualityLevel
- audioEnabled
- reducedMotion

3D 相机的逐帧位置不应频繁写入 React 全局状态。

高频动画状态应尽量保存在 Three.js 对象或 ref 中。

## 9.5 动画架构

使用 GSAP 控制：

- 相机飞行
- 页面过渡
- 星球接近
- UI 出现与消失

使用 useFrame 控制：

- 星球自转
- 轨道运动
- Shader 时间参数
- 轻量粒子动画

避免多个动画系统同时修改同一个相机属性。

---

# 第十章 数据设计

## 10.1 纯前端数据管理

不使用数据库。

采用：

- TypeScript 配置
- JSON 文件
- MDX 内容
- 本地静态图片
- 本地模型和纹理

所有内容随 Git 仓库进行版本管理。

## 10.2 推荐数据目录

```text
src/
  data/
    universe.ts
    celestial/
      knowledge.ts
      emotions.ts
      earth.ts
    stories/
      index.ts
    travels/
      places.ts
      visits.ts
    projects/
      index.ts
```

## 10.3 天体类型

```ts
type CelestialType =
  | "galaxy"
  | "star"
  | "planet"
  | "moon"
  | "celestial-body"
  | "region";

interface CelestialNode {
  id: string;
  parentId?: string;
  type: CelestialType;
  name: string;
  description?: string;
  themeId: string;
  storyIds?: string[];
  children?: CelestialNode[];
  visual?: {
    radius?: number;
    texture?: string;
    atmosphere?: boolean;
    rotationSpeed?: number;
  };
  orbit?: {
    radius: number;
    speed: number;
    inclination?: number;
  };
}
```

这里的 radius 和 orbit.radius 使用场景单位，不代表真实天文距离。

生产实现中应进一步为 themeId、节点类型和资源路径增加校验。

## 10.4 示例：知识星球

```ts
const knowledge: CelestialNode = {
  id: "knowledge",
  type: "planet",
  name: "学习星球",
  themeId: "knowledge",
  children: [
    {
      id: "languages",
      parentId: "knowledge",
      type: "planet",
      name: "语言星球",
      themeId: "language",
      children: [
        {
          id: "japanese",
          parentId: "languages",
          type: "moon",
          name: "日语卫星",
          themeId: "language-jp",
        },
        {
          id: "english",
          parentId: "languages",
          type: "moon",
          name: "英语卫星",
          themeId: "language-en",
        },
      ],
    },
    {
      id: "it",
      parentId: "knowledge",
      type: "planet",
      name: "IT 星球",
      themeId: "technology",
    },
  ],
};
```

完整项目还应支持：

- 汉语卫星
- 德语卫星
- 前端技术节点
- 后端技术节点
- 云计算节点
- 其他自定义节点

## 10.5 故事数据

```ts
interface Story {
  id: string;
  title: string;
  summary?: string;
  contentPath: string;
  startDate?: string;
  endDate?: string;
  datePrecision?: "day" | "month" | "year";
  emotionTags?: string[];
  celestialNodeIds: string[];
  images?: string[];
}
```

故事正文可以保存为 MDX。

一个故事可以关联多个天体。

## 10.6 旅行数据

```ts
interface TravelPlace {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface TravelVisit {
  id: string;
  placeId: string;
  visitedAt: string;
  title: string;
  description?: string;
  photos: string[];
  storyIds?: string[];
}
```

同一个地点可以存在多条 Visit 记录。

## 10.7 数据校验

建议使用 Zod 或构建期 TypeScript 校验脚本检查：

- 重复 ID
- 不存在的 parentId
- 循环引用
- 缺失的 themeId
- 无效的经纬度
- 缺失的图片路径
- 不存在的 Story ID
- 错误的日期格式

构建时发现错误应直接失败。

---

# 第十一章 项目目录结构

```text
my-universe/
├── public/
│   ├── textures/
│   │   ├── planets/
│   │   ├── earth/
│   │   └── nebulae/
│   ├── models/
│   ├── audio/
│   ├── images/
│   │   ├── stories/
│   │   └── travels/
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── stories/
│   │   ├── knowledge/
│   │   └── travels/
│   │
│   ├── components/
│   │   ├── universe/
│   │   ├── celestial/
│   │   ├── earth/
│   │   ├── camera/
│   │   ├── effects/
│   │   └── ui/
│   │
│   ├── shaders/
│   │   ├── ocean/
│   │   ├── lava/
│   │   ├── atmosphere/
│   │   └── nebula/
│   │
│   ├── data/
│   │   ├── celestial/
│   │   ├── stories/
│   │   ├── travels/
│   │   └── universe.ts
│   │
│   ├── content/
│   │   └── stories/
│   │
│   ├── hooks/
│   ├── stores/
│   ├── lib/
│   ├── types/
│   └── styles/
│
├── scripts/
│   └── validate-data.ts
│
├── next.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

# 第十二章 性能优化

## 12.1 核心原则

电影级视觉效果不能以严重牺牲浏览器性能为代价。

必须实现自适应画质。

## 12.2 画质等级

建议提供三个等级。

Low：

- 低分辨率纹理
- 减少粒子数量
- 关闭昂贵后期效果
- 简化云层
- 限制设备像素比

Medium：

- 中等纹理
- 基础大气效果
- 适度 Bloom
- 标准粒子数量

High：

- 高分辨率纹理
- 高质量大气
- 完整云层
- 更丰富的粒子
- 高质量后期处理

## 12.3 目标性能

桌面端：

目标 60 FPS。

移动端：

目标 30–60 FPS，视设备性能调整。

这是设计目标，不是所有设备都能保证达到的结果。

## 12.4 关键优化手段

- InstancedMesh
- GPU 粒子
- Frustum Culling
- LOD
- Texture Compression
- Lazy Loading
- Dynamic Import
- Shader Complexity Control
- Resource Disposal
- Adaptive DPR

纹理优先考虑 KTX2/Basis 压缩。

模型优先考虑 glTF/GLB。

3D 场景按需加载。

切换星球时及时释放不再使用的 GPU 资源，但需要避免错误释放共享纹理。

## 12.5 首屏优化

首屏不应该立即下载所有星球的高分辨率资源。

推荐加载顺序：

1. HTML 和基础 UI。
2. 低成本星空背景。
3. 宇宙首页核心天体。
4. 当前选中星球的高质量资源。
5. 其他星球的资源按需加载。

即使 WebGL 初始化失败，用户仍然应该能够通过 HTML 页面访问网站内容。

---

# 第十三章 部署架构

## 13.1 部署原则

由于项目不使用后端和数据库，生产环境不需要常驻应用服务器。

网站构建完成后，所有内容都可以作为静态文件分发。

## 13.2 首选部署平台

Cloudflare Pages。

原因：

- 支持静态网站
- 全球 CDN
- HTTPS
- 自定义域名
- Git 自动部署
- 不需要管理 Node.js 运行进程
- 适合大规模静态资源分发

需要注意：平台的构建配额、文件数量、单文件大小和带宽政策可能变化，正式上线前应核实当时的官方限制。

## 13.3 推荐生产架构

```text
Developer
    |
    v
GitHub Repository
    |
    v
Cloudflare Pages Build
    |
    v
Next.js Static Export
    |
    v
Static Files (out/)
    |
    v
Cloudflare CDN
    |
    v
Custom Domain + HTTPS
    |
    v
Visitor Browser
    |
    v
React + Three.js + WebGL
```

3D 场景的渲染主要发生在访客的浏览器中。

Cloudflare 负责提供静态文件，而不是在服务器上渲染星球。

## 13.4 Cloudflare Pages 构建配置

推荐：

Framework：Next.js Static Export / 自定义静态构建配置。

Build Command：

```bash
npm run build
```

Output Directory：

```text
out
```

Node.js 版本应与所选 Next.js 版本兼容。

建议通过 `.nvmrc` 或构建环境变量固定 Node.js 主版本。

## 13.5 现有云服务器的用途

现有云服务器可以继续用于：

- Git 仓库操作
- 开发环境
- 本地构建
- 测试
- 资源处理
- CI 辅助任务

但不建议仅为了托管这个静态网站而长期运行 Node.js 服务。

如果未来希望完全自主部署，也可以使用：

Nginx + 静态构建文件 + HTTPS。

这属于备选方案。

## 13.6 自定义域名

建议使用独立域名。

例如：

my-universe.example

或者使用现有域名的子域名：

universe.example.com

实际域名根据个人品牌决定。

配置：

- DNS
- HTTPS
- CDN 缓存
- HTTP 到 HTTPS 跳转
- 安全响应头

## 13.7 缓存策略

带哈希的 JS/CSS 文件可以长期缓存。

大型纹理和模型建议使用版本化文件名。

HTML 文件采用较短缓存时间，确保新版本能够及时生效。

需要避免 HTML 与旧资源缓存不一致。

---

# 第十四章 安全与隐私

## 14.1 纯前端项目的安全边界

所有随网站发布的 JSON、照片、文字和静态文件原则上都可能被访客获取。

前端隐藏按钮不能保护私人数据。

因此不得将以下信息放入公开构建产物：

- 私人日记原文
- 身份证件
- 未公开的个人联系方式
- 账号密码
- API 密钥
- 不希望公开的精确行程
- 未经允许的他人私人照片

## 14.2 内容发布控制

建议每条故事增加发布状态：

- draft
- public
- private

但 private 内容必须在构建时完全排除，不能仅在前端隐藏。

## 14.3 资源版权

使用的地球纹理、星球素材、音乐、图片和 3D 模型都必须具有合适的使用许可。

建议保存：

- 来源
- 作者
- 许可证
- 是否允许商业使用
- 是否需要署名

---

# 第十五章 SEO 与可访问性

## 15.1 SEO

虽然网站以 3D 为核心，但搜索引擎不一定能够完整理解 WebGL 场景。

因此需要提供独立的 HTML 内容页面。

例如：

- /knowledge
- /travels
- /stories/example-story

这些页面可以静态生成。

3D 场景负责沉浸式探索。

HTML 页面负责可访问性、内容索引和直接分享。

## 15.2 可访问性

支持：

- 键盘导航
- 清晰的按钮标签
- 减少动态效果
- 关闭背景音乐
- 关闭高强度视觉特效
- 图片替代文字
- 移动端触摸操作
- WebGL 不可用时的替代内容

音乐默认不应强制自动播放。

---

# 第十六章 开发路线图

## Phase 1 — 基础宇宙 MVP

目标：

建立能够实际运行的 3D 网站。

功能：

- Next.js 项目初始化
- React Three Fiber 场景
- 星空背景
- 基础星球
- 鼠标交互
- 相机控制
- 星球点击
- 基础 UI
- Cloudflare Pages 测试部署

验收标准：

用户能够进入网站，观察宇宙，点击星球并查看内容。

## Phase 2 — 自定义天体系统

目标：

实现完整的递归数据结构。

功能：

- 自定义星系
- 自定义星球
- 自定义卫星
- 多层级导航
- 父子节点关系
- 动态轨道生成
- 节点配置
- 内容关联

验收标准：

仅通过修改配置文件，就能添加新的天体层级，不需要修改核心渲染逻辑。

## Phase 3 — 知识宇宙

目标：

完成学习星球系统。

功能：

- 学习星球
- 语言星球
- IT 星球
- 语言卫星
- 技术卫星
- 技术内容面板
- 项目关联

验收标准：

用户可以从学习星球进入语言星球，再进入日语卫星，并查看相关经历。

## Phase 4 — 情绪宇宙

目标：

实现电影级情绪星球。

优先顺序：

1. 水星
2. 火星
3. 金星
4. 其他星球

功能：

- 海洋 Shader
- 岩浆 Shader
- 大气效果
- 情绪故事
- 环境变化
- 电影式镜头

验收标准：

水星和火星拥有明显不同的环境、镜头和叙事体验。

## Phase 5 — 旅行地球

目标：

完成交互式 3D 地球。

功能：

- 地球真实纹理
- 云层
- 大气
- 地点标记
- 经纬度定位
- 地点聚焦
- 旅行照片
- 旅行故事

验收标准：

用户可以旋转地球，点击东京等地点并查看对应旅行记录。

## Phase 6 — 时间轴

目标：

将人生经历与时间关联。

功能：

- 年份选择
- 时间轴拖动
- 星球状态变化
- 故事过滤
- 未来节点

## Phase 7 — 生产优化

目标：

正式公开上线。

功能：

- 画质自适应
- 移动端适配
- 静态资源压缩
- SEO
- 可访问性
- 安全检查
- 版权检查
- 自动部署
- 自定义域名

---

# 第十七章 MVP 范围

为了控制开发复杂度，第一版不应包含所有高级特效。

首个可发布版本建议包含：

- 一个真实感宇宙背景
- 一个可旋转的学习星球
- 一个语言星球
- 一个 IT 星球
- 四颗语言卫星
- 若干技术节点
- 一颗情绪水星
- 一颗情绪火星
- 一颗旅行地球
- 三个旅行地点
- 基础故事面板
- 多层级相机导航
- 移动端基础支持

高级功能可以后续迭代。

暂时不实现：

- 用户账号
- 登录
- 数据库
- 在线编辑后台
- 实时多人探索
- 复杂物理模拟
- 完整地表自由行走
- 全宇宙实时光线追踪

---

# 第十八章 长期扩展方向

未来可以逐步加入：

1. 自定义星球主题编辑器。
2. 可配置的星球材质。
3. 星球之间的知识关联线。
4. 根据时间变化的情绪环境。
5. 旅行路线动画。
6. 不同人生阶段的宇宙快照。
7. 星空搜索功能。
8. 中日英多语言界面。
9. 可分享的星球链接。
10. 不同设备的专属画质预设。

这些功能仍然可以在纯前端架构中逐步实现。

如果未来需要让访客在线创建并永久保存自己的宇宙，则需要重新评估持久化方案。

---

# 第十九章 最终技术决策

项目名称：

My Universe

项目定位：

电影级 3D 人生宇宙。

核心框架：

Next.js + React + TypeScript。

3D 技术：

Three.js + React Three Fiber。

动画：

GSAP。

视觉：

GLSL Shader + Postprocessing。

样式：

Tailwind CSS。

状态管理：

Zustand。

内容：

JSON + TypeScript + MDX。

旅行：

单颗交互式 3D 地球。

知识结构：

递归自定义天体系统。

情绪系统：

情绪星球 + 人生故事。

数据库：

无。

后端：

无。

部署：

Cloudflare Pages。

备选部署：

Nginx 静态托管。

核心开发原则：

**数据驱动、模块化、递归结构、电影级视觉、按需加载、静态部署。**

---

# 第二十章 项目最终愿景

My Universe 不应该只是一个展示过去经历的网站。

它应该是一个能够随着人生不断成长的宇宙。

每学习一项新技术，就可以点亮一颗新的卫星。

每掌握一门语言，就可以丰富语言星球。

每到访一座新的城市，就可以在地球上留下一个坐标。

每经历一段重要的人生阶段，就可以为情绪星球增加一个故事。

随着时间推移，整个宇宙会逐渐变得更加丰富。

**最终，我们希望用户看到的不是一份简历，而是一个人的人生如何逐渐形成属于自己的宇宙。**

*Every planet holds a story. Every story holds an emotion.*

*每一颗星球都有故事，每一段故事都值得被看见。*
