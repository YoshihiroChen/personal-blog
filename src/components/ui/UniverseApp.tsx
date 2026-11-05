'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { planetIds, planetHref } from '@/lib/planets';
import Link from 'next/link';
import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronRight, Compass, Globe2, Layers3, Maximize, Menu, Orbit, Search, Settings2, Volume2, VolumeX, X } from 'lucide-react';
import { useUniverse } from '@/stores/universe';
import { ancestors, nodeById, nodes, themes } from '@/data/universe';
import { stories, storyById } from '@/data/stories';
import { places, visits } from '@/data/travels';
import { dateLabel, visibleInYear } from '@/lib/content';
import type { Mode } from '@/types/universe';
const Scene = dynamic(()=>import('@/components/universe/Scene'), {ssr:false,loading:()=><div className="scene-loading"><Orbit size={24}/><span>正在点亮星空</span></div>});
const navigation: {id: Mode;label: string;english: string}[]=[{id:'overview',label:'宇宙探索',english:'Explore'},{id:'knowledge',label:'知识与成长',english:'Knowledge'},{id:'emotions',label:'情绪世界',english:'Emotions'},{id:'earth',label:'旅行地球',english:'Earth'},{id:'timeline',label:'时间轨迹',english:'Timeline'}];
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return{failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}
function SceneFallback() {
  const patch = useUniverse(s => s.patch);
  useEffect(() => { patch({ introComplete: true, interfaceVisible: true, flying: false }); }, [patch]);
  return <div className="webgl-fallback"><Orbit size={36}/><h2>星空暂时无法展开</h2><p>你仍然可以通过目录，探索每一颗星球与故事。</p><Link href="/knowledge/">打开知识档案 <ArrowRight size={16}/></Link></div>;
}
function AmbientAudio() {
  const enabled=useUniverse(s=>s.audioEnabled);
  useEffect(()=>{
    if(!enabled)return;
    const context=new AudioContext(), gain=context.createGain();gain.gain.value=.025;gain.connect(context.destination);
    const oscillators=[55,82.41,110.12].map((frequency,i)=>{const o=context.createOscillator();o.type='sine';o.frequency.value=frequency;o.detune.value=i*3;o.connect(gain);o.start();return o;});
    void context.resume().catch(()=>useUniverse.getState().patch({audioEnabled:false}));
    return ()=>{oscillators.forEach(o=>o.stop());void context.close();};
  },[enabled]);return null;
}
function StoryPanel() {
  const {selectedId,activeStoryId,selectedPlaceId,year,patch,explore}=useUniverse();
  const node=selectedId?nodeById[selectedId]:null;
  const story=activeStoryId?storyById[activeStoryId]:null;
  const place=places.find(p=>p.id===selectedPlaceId);
  const panelRef=useRef<HTMLElement>(null);
  useEffect(()=>{panelRef.current?.focus({preventScroll:true});},[selectedId,activeStoryId,selectedPlaceId]);
  if(!node&&!story&&!place)return null;
  const related=stories.filter(s=>s.status==='public'&&visibleInYear(s.date,year)&&s.celestialNodeIds.includes(node?.id??''));
  const storyIndex=related.findIndex(s=>s.id===activeStoryId);
  return <aside className="story-panel glass" ref={panelRef} tabIndex={-1} aria-label="探索内容">
    <div className="panel-top"><span className="eyebrow">{place?'FIELD NOTES':story?'A CHAPTER OF LIFE':'CELESTIAL ARCHIVE'}</span><button className="icon-button" aria-label="关闭内容面板" onClick={()=>patch({selectedId:null,activeStoryId:null,selectedPlaceId:null})}><X size={17}/></button></div>
    {place?<>
      <span className="panel-kicker">{place.country} / {place.latitude.toFixed(2)}° N · {place.longitude.toFixed(2)}° E</span>
      <h2>{place.name}<span>{place.english}</span></h2><p className="panel-description">{place.description}</p>
      <span className="demo-tag">示例旅行地点</span>
      <div className="visit-list">{visits.filter(v=>v.placeId===place.id&&v.status==='public'&&visibleInYear(v.visitedAt,year)).map(v=><article key={v.id}><time>{dateLabel(v.visitedAt)}</time><h3>{v.title}</h3><p>{v.description}</p>{v.photos.map(photo=><img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy"/>)}{v.storyIds.filter(id=>storyById[id]&&visibleInYear(storyById[id].date,year)).map(id=><button className="text-button" key={id} onClick={()=>patch({activeStoryId:id,selectedPlaceId:null})}>阅读故事 <ArrowRight size={14}/></button>)}</article>)}</div>
    </>:story?<>
      <button className="text-button panel-return" onClick={()=>patch({activeStoryId:null})}><ArrowLeft size={13}/> 返回星球档案</button>
      <time className="panel-kicker">{dateLabel(story.date)}</time><h2>{story.title}</h2><p className="serif subtitle">{story.subtitle}</p>
      <div className="tag-row">{story.emotionTags.map(t=><span key={t}>{t}</span>)}{story.demo&&<span>示例故事</span>}</div>
      <div className="story-prose">{story.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div>
      <div className="related-links">{story.celestialNodeIds.map(id=><button className="text-button" key={id} onClick={()=>explore(id)}>{nodeById[id].name}<ChevronRight size={14}/></button>)}</div>
      {related.length>1&&<div className="story-pagination"><button disabled={storyIndex<=0} onClick={()=>patch({activeStoryId:related[storyIndex-1]?.id})}><ArrowLeft size={14}/> 上一篇</button><button disabled={storyIndex<0||storyIndex>=related.length-1} onClick={()=>patch({activeStoryId:related[storyIndex+1]?.id})}>下一篇 <ArrowRight size={14}/></button></div>}
      <Link className="text-button permalink" href={`/stories/${story.id}/`}>打开独立阅读页 <ArrowRight size={14}/></Link>
    </>:node?.id==='sun'?<>
      <span className="panel-kicker">THE SUN / ABOUT ME</span><h2>你好，欢迎来到我的宇宙。</h2>
      <p className="panel-description">这里是我的自我介绍，也是这片宇宙的起点。知识、情绪与旅行，沿着各自的轨道，组成我的世界。</p>
      <div className="profile-sections"><section><h3>我是谁</h3><p>个人简介待填写。这里将介绍我的名字、现在的生活与正在做的事。</p></section>
      <section><h3>我关注什么</h3><p>兴趣与方向待填写。你可以先探索月球上的知识与成长，以及地球上的旅行足迹。</p><Link href="/planets/knowledge/">探索知识与成长 →</Link><Link href="/planets/earth/">前往旅行地球 →</Link></section>
      <section><h3>如何找到我</h3><p>联系方式待填写。</p></section></div>
    </>:node?<>
      <div className="planet-emblem" style={{'--planet-color':themes[node.themeId].color} as React.CSSProperties}><Orbit size={27} strokeWidth={1}/></div>
      <span className="panel-kicker">{themes[node.themeId].label}</span><h2>{node.name}<span>{node.english}</span></h2><p className="panel-description">{node.description}</p>
      {(node.since??0)>year&&<p className="future-note">未来坐标 · {node.since}</p>}
      {node.children?.length?<div className="node-children"><h3>继续探索 <span>{String(node.children.length).padStart(2,'0')}</span></h3>{node.children.map((child,i)=><button key={child.id} onClick={()=>explore(child.id)}><span className="list-number">{String(i+1).padStart(2,'0')}</span><span>{child.name}<small>{child.english}</small></span><ArrowRight size={14}/></button>)}</div>:null}
      {node.id==='earth'&&<div className="node-children"><h3>旅行坐标 <span>DEMO</span></h3>{places.filter(p=>visits.some(v=>v.placeId===p.id&&v.status==='public'&&visibleInYear(v.visitedAt,year))).map(place=><button key={place.id} onClick={()=>patch({selectedPlaceId:place.id})}><Globe2 size={15}/><span>{place.name}<small>{place.english} · {place.country}</small></span><ArrowRight size={14}/></button>)}</div>}
      <div className="story-list"><h3>轨道上的故事 <span>{String(related.length).padStart(2,'0')}</span></h3>{related.length?related.map(story=><button key={story.id} onClick={()=>patch({activeStoryId:story.id})}><time>{dateLabel(story.date)}</time><span>{story.title}</span><ArrowRight size={14}/></button>):<p className="empty-note">这里还有留白。等待一段真实的经历，让这颗星球有自己的故事。</p>}</div>
      <span className="demo-note">当前使用设计演示内容，尚未填写个人真实经历。</span>
    </>:null}
  </aside>;
}
export default function UniverseApp({initialNode,initialSelected}:{initialNode?:string;initialSelected?:string}) {
  const router=useRouter();
  const {solarExploring,beginExploration}=useUniverse();
  const state=useUniverse();const {mode,focusedId,selectedId,year,quality,reducedMotion,audioEnabled,introComplete,interfaceVisible,toggleInterface,patch,navigate,explore,back}=state;
  const [searchOpen,setSearchOpen]=useState(false),[query,setQuery]=useState(''),[settingsOpen,setSettingsOpen]=useState(false),[about,setAbout]=useState(false),[failed,setFailed]=useState(false),[notice,setNotice]=useState('');
  const immersive=focusedId==='universe'&&mode==='overview'&&!interfaceVisible;
  const searchRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');patch({reducedMotion:media.matches,quality:window.innerWidth<768?'low':'medium'});
    const entryNode=initialNode??new URLSearchParams(window.location.search).get('node');if(entryNode&&nodeById[entryNode]){explore(entryNode);if(initialSelected&&nodeById[initialSelected])patch({selectedId:initialSelected});}
    const listener=(e:MediaQueryListEvent)=>patch({reducedMotion:e.matches});media.addEventListener('change',listener);
    const key=(e:KeyboardEvent)=>{
      if(e.key.toLowerCase()==='h'&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!(e.target instanceof HTMLElement&&e.target.closest('input,textarea,[contenteditable=true]'))){toggleInterface();}
      if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setSearchOpen(v=>!v);}
      if(e.key==='Escape'){setSearchOpen(false);setSettingsOpen(false);setAbout(false);patch({selectedId:null,activeStoryId:null,selectedPlaceId:null,...(!useUniverse.getState().introComplete?{introComplete:true,interfaceVisible:true}:{})});}
      if(e.altKey&&e.key==='ArrowLeft'){e.preventDefault();back();}
    };window.addEventListener('keydown',key);return()=>{media.removeEventListener('change',listener);window.removeEventListener('keydown',key);};
  },[patch,back,explore,toggleInterface,initialNode,initialSelected]);
  useEffect(()=>{if(searchOpen)searchRef.current?.focus();},[searchOpen]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4000);return()=>clearTimeout(timer);},[notice]);
  const fallback=<SceneFallback/>;
  const result=nodes.filter(n=>n.id!=='universe'&&`${n.name} ${n.english}`.toLowerCase().includes(query.toLowerCase())).slice(0,12);
  async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setNotice('此浏览器暂不支持全屏，请使用浏览器的全屏功能。');}}
  return <main className={`universe-app ${selectedId?'with-panel':''} ${reducedMotion?'reduced-motion':''} ${immersive?'interface-hidden':''} ${focusedId==='sun'?'sun-view':''}`} >
    <a className="skip-link" href="#content-navigation">跳至内容导航</a>
    <div className="cosmic-background" aria-hidden="true"><div className="nebula nebula-one"/><div className="nebula nebula-two"/><div className="dust"/></div>
    <div className="scene-container" aria-label="交互式三维人生宇宙">{failed?fallback:<SceneBoundary fallback={fallback}><Scene onError={()=>setFailed(true)}/></SceneBoundary>}</div>
    <div className="vignette" aria-hidden="true"/>
    {focusedId==='universe'&&mode==='overview'&&<button className="interface-toggle" aria-label={interfaceVisible?'隐藏导航与介绍':'显示导航与介绍'} aria-expanded={interfaceVisible} aria-controls="universe-header" title="显示或隐藏界面（H）" onClick={()=>toggleInterface()}>{interfaceVisible?<X size={17}/>:<Menu size={17}/>}</button>}
    {immersive&&<div className="immersive-hint">{introComplete?'拖动旋转 · 滚轮缩放':'正在靠近太阳系…'}<span>{introComplete?'太阳系 · 距离与大小已缩放':'按 Esc 跳过开场'}</span></div>}
    <header id="universe-header" className="site-header"><button className="brand" onClick={()=>navigate('overview')} aria-label="My Universe 返回宇宙首页"><span className="brand-icon"><Orbit size={28} strokeWidth={1}/></span><span>MY UNIVERSE<small>一个人的宇宙，无数种可能</small></span></button>
      <nav className="main-nav" aria-label="主导航">{navigation.map(item=><button key={item.id} className={mode===item.id?'active':''} aria-current={mode===item.id?'page':undefined} onClick={()=>navigate(item.id)}>{item.label}</button>)}<button onClick={()=>router.push(planetHref('sun'))}>关于我</button></nav>
      <div className="header-actions"><button className="icon-button" aria-label="搜索天体" onClick={()=>setSearchOpen(true)}><Search size={17}/></button><span className="action-divider"/><button className={`icon-button ${audioEnabled?'enabled':''}`} aria-label={audioEnabled?'关闭环境音':'开启环境音'} aria-pressed={audioEnabled} onClick={()=>{if(typeof AudioContext==='undefined'){setNotice('此浏览器不支持环境音。');return;}patch({audioEnabled:!audioEnabled});}}>{audioEnabled?<Volume2 size={17}/>:<VolumeX size={17}/>}</button><button className="icon-button" aria-label="画质与动态设置" onClick={()=>setSettingsOpen(v=>!v)}><Settings2 size={17}/></button><button className="icon-button fullscreen-button" aria-label="切换全屏" onClick={toggleFullscreen}><Maximize size={16}/></button></div>
    </header>
    <div className="corner-coordinate">EST. 2026 <span/> A PERSONAL COSMOS</div>
    {focusedId==='universe'&&mode!=='timeline'?<section className={`hero ${solarExploring?'exploring':''}`}><div className="eyebrow hero-eyebrow"><span className="live-dot"/> THE UNIVERSE WITHIN</div><h1>把人生，<br/>写进<span className="serif">宇宙。</span></h1><p className="hero-description">有些故事，属于遥远的星球。<br/>有些答案，藏在自己的轨道。<br/>这是我的世界，也是一场没有终点的探索。</p><button className="explore-button" onClick={beginExploration}><Compass size={17}/><span>开始探索</span><ArrowRight size={17}/></button><div className="hero-footnote"><span>01 — ∞</span><p>EVERY PLANET HOLDS A STORY.<br/>EVERY STORY HOLDS AN EMOTION.</p></div></section>:<section className="section-heading"><button className="text-button" onClick={back}><ArrowLeft size={14}/> 返回上一级</button><div className="eyebrow">{mode==='timeline'?'TRACES THROUGH TIME':nodeById[focusedId]?.english.toUpperCase()}</div><h1>{mode==='timeline'?'时间的引力':focusedId==='sun'?'太阳 · 关于我':nodeById[focusedId]?.name}</h1><p>{mode==='timeline'?'拨动年份，重新看见那些走过的轨道。':nodeById[focusedId]?.description}</p>{mode==='earth'&&<span className="demo-tag">示例足迹 · 拖动旋转地球</span>}</section>}
    {focusedId==='universe'&&mode==='overview'&&<div className="feature-caption"><span>IN FOCUS / 05</span><span className="caption-rule"/><div><h2>好奇，是永恒的引力。</h2><p>SATURN — THE CURIOUS WORLD</p></div></div>}
    {focusedId==='universe'&&mode==='overview'&&<div className="intro-index"><span className="index-mark">✦</span><span>知识是星光，情绪是引力，旅行是轨迹。</span><span className="index-number">EXPLORE YOUR INNER SPACE</span></div>}
    <StoryPanel/>
    {mode==='timeline'&&<section className="timeline-panel glass"><div className="panel-top"><span className="eyebrow">LIFE IN ORBIT</span><span>{year}</span></div><h2>那些年，点亮的星光</h2><div className="timeline-stories">{stories.filter(s=>s.status==='public'&&visibleInYear(s.date,year)).sort((a,b)=>dateLabel(b.date).localeCompare(dateLabel(a.date))).map(story=><button key={story.id} onClick={()=>{explore(story.celestialNodeIds[0]);patch({activeStoryId:story.id});}}><time>{dateLabel(story.date)}</time><span>{story.title}<small>{story.emotionTags.join(' / ')} · 示例</small></span><ArrowRight size={14}/></button>)}</div></section>}
    <div className={`year-control ${mode==='timeline'?'expanded':''}`}><span className="eyebrow">TIME COORDINATE</span><label htmlFor="year-slider">{year}<span>{year>2026?'未来坐标':'年'}</span></label><input id="year-slider" aria-label="选择观察年份" type="range" min="2018" max="2028" value={year} onChange={e=>{const nextYear=Number(e.target.value);patch({year:nextYear,activeStoryId:state.activeStoryId&&visibleInYear(storyById[state.activeStoryId].date,nextYear)?state.activeStoryId:null,selectedPlaceId:null});}}/><div className="year-scale"><span>2018</span><span>2028</span></div></div>
    {solarExploring&&focusedId==='universe'&&<div className="solar-explore-caption">选择一颗星球，进入它的世界<span>太阳 · 关于我 / 月球 · 知识与成长 / 地球 · 旅行</span></div>}

    <footer className="scene-footer"><div className="breadcrumbs"><span className="location-dot"/><button onClick={()=>navigate('overview')}>My Universe</button>{ancestors(focusedId).slice(1).map(n=><span key={n.id}><ChevronRight size={11}/><button onClick={()=>explore(n.id)}>{n.name}</button></span>)}</div><div className="interaction-hints"><span><span className="mouse-symbol"/> 拖动旋转</span><span>↕ 滚轮缩放</span><span>↗ 点击探索</span></div><button className="text-button catalog-button" onClick={()=>document.getElementById('content-navigation')?.scrollIntoView({behavior:reducedMotion?'instant':'smooth'})}><Layers3 size={14}/> 内容目录 <ArrowDown size={13}/></button></footer>
    <section id="content-navigation" className="content-navigation"><div><span className="eyebrow">A MAP OF MY UNIVERSE</span><h2>每一种探索，都有入口。</h2><p>你可以在星空中漫游，也可以从这里，安静地开始阅读。</p></div><nav className="planet-directory" aria-label="星球页面">{planetIds.map(id=><Link key={id} href={planetHref(id)}>{nodeById[id].name}<ArrowRight size={12}/></Link>)}</nav><div className="archive-links"><Link href="/knowledge/"><span>01 / KNOWLEDGE</span><h3>知识与成长 <ArrowRight size={19}/></h3><p>语言、技术，以及持续生长的好奇心。</p></Link><Link href="/stories/"><span>02 / INNER WORLDS</span><h3>情绪与人生 <ArrowRight size={19}/></h3><p>每一种心情，都拥有自己的星球。</p></Link><Link href="/travels/"><span>03 / EARTH</span><h3>地球上的足迹 <ArrowRight size={19}/></h3><p>把远方，变成生命里闪光的坐标。</p></Link></div><div className="archive-bottom"><span>MY UNIVERSE © 2026</span><span>此版本的故事与旅行均为示例内容。</span><a href="#">回到星空 ↑</a></div></section>
    {settingsOpen&&<div className="settings-popover glass"><div className="panel-top"><h2>探索设置</h2><button className="icon-button" aria-label="关闭设置" onClick={()=>setSettingsOpen(false)}><X size={16}/></button></div><label>画面质量</label><div className="quality-options">{(['low','medium','high'] as const).map((q,i)=><button key={q} className={quality===q?'active':''} onClick={()=>patch({quality:q})}>{['轻量','标准','精细'][i]}{quality===q&&<Check size={12}/>}</button>)}</div><button className="setting-toggle" role="switch" aria-checked={reducedMotion} onClick={()=>patch({reducedMotion:!reducedMotion})}><span>减少动态效果<small>简化飞行，暂停星球自转</small></span><span className={`toggle ${reducedMotion?'on':''}`}/></button><p>手机默认使用轻量画质。按 Esc 可中止镜头飞行。</p></div>}
    {searchOpen&&<div className="modal-backdrop" onClick={()=>setSearchOpen(false)}><section className="search-modal glass" role="dialog" aria-modal="true" aria-label="搜索宇宙" onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Tab'){const focusable=e.currentTarget.querySelectorAll<HTMLElement>('button,input');const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}><div className="search-input"><Search size={18}/><input ref={searchRef} placeholder="寻找一颗星球、一门语言、一项技术…" aria-label="搜索天体名称" value={query} onChange={e=>setQuery(e.target.value)}/><button className="icon-button" aria-label="关闭搜索" onClick={()=>setSearchOpen(false)}><X size={17}/></button></div><div className="search-results">{result.length?result.map(n=><button key={n.id} onClick={()=>{explore(n.id);setSearchOpen(false);setQuery('');}}><Orbit size={17}/><span>{n.name}<small>{ancestors(n.id).slice(1).map(a=>a.english).join(' / ')}</small></span><ArrowRight size={15}/></button>):<p>这片星空中还没有这个坐标。</p>}</div><div className="search-footer">搜索整个知识与情绪宇宙 <kbd>Esc 关闭</kbd></div></section></div>}
    {about&&<div className="modal-backdrop" onClick={()=>setAbout(false)}><section className="about-modal glass" role="dialog" aria-modal="true" aria-label="关于这个宇宙" onKeyDown={e=>{if(e.key==='Tab')e.preventDefault();}} onClick={e=>e.stopPropagation()}><button className="icon-button close-about" autoFocus aria-label="关闭关于" onClick={()=>setAbout(false)}><X size={18}/></button><Orbit size={40} strokeWidth={.8}/><span className="eyebrow">A UNIVERSE, ALWAYS BECOMING</span><h2>你好，<br/>欢迎来到我的宇宙。</h2><p>这里用星球收藏知识，用光线表达心情，用地球记录远方。它会随着人生，一点点生长。</p><p>这是 My Universe 的第一个探索版本。个人介绍、真实故事和旅行照片，等待主人亲手填入。</p><span className="demo-tag">当前为示例内容</span></section></div>}
    {notice&&<div className="toast" role="status">{notice}</div>}
    <AmbientAudio/>
  </main>;
}
