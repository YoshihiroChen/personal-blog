'use client';
import dynamic from 'next/dynamic';
import AboutProfile from '@/components/ui/AboutProfile';
import WorksExplorer from '@/components/ui/WorksExplorer';
import { fleetShips, isFleetShipId, type FleetShipId } from '@/data/works';
import LunarExplorer from '@/components/ui/LunarExplorer';
import { lunarLocation } from '@/lib/lunar';
import { useRouter } from 'next/navigation';
import { planetHref } from '@/lib/planets';
import Link from 'next/link';
import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Compass, Globe2, Maximize, Menu, Orbit, Search, Settings2, Volume2, VolumeX, X } from 'lucide-react';
import { useUniverse } from '@/stores/universe';
import { ancestors, nodeById, nodes, themes } from '@/data/universe';
import { stories, storyById } from '@/data/stories';
import { places, visits } from '@/data/travels';
import { dateLabel, visibleInYear } from '@/lib/content';
import type { Mode } from '@/types/universe';
const Scene = dynamic(()=>import('@/components/universe/Scene'), {ssr:false,loading:()=><div className="scene-loading"><Orbit size={24}/><span>Finding our place among the stars</span></div>});
const navigation: {id: Mode | 'about';label: string}[]=[{id:'overview',label:'Explore'},{id:'about',label:'About Me'},{id:'knowledge',label:'Knowledge'},{id:'works',label:'My Works'},{id:'earth',label:'Travel Earth'},{id:'emotions',label:'Inner Worlds'},{id:'timeline',label:'Timeline'}];
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return{failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}
function SceneFallback() {
  const patch = useUniverse(s => s.patch);
  useEffect(() => { patch({ introComplete: true, interfaceVisible: true, flying: false }); }, [patch]);
  return <div className="webgl-fallback"><Orbit size={36}/><h2>The stars are taking a moment</h2><p>You can still browse my notes or choose a world from the navigation.</p><Link href="/knowledge/">Browse my notes <ArrowRight size={16}/></Link></div>;
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
  return <aside className="story-panel glass" ref={panelRef} tabIndex={-1} aria-label="Explore content">
    <div className="panel-top"><span className="eyebrow">{place?'FIELD NOTES':story?'A CHAPTER OF LIFE':'CELESTIAL ARCHIVE'}</span><button className="icon-button" aria-label="Close content panel" onClick={()=>patch({selectedId:null,activeStoryId:null,selectedPlaceId:null})}><X size={17}/></button></div>
    {place?<>
      <span className="panel-kicker">{place.country} / {place.latitude.toFixed(2)}° N · {place.longitude.toFixed(2)}° E</span>
      <h2>{place.name}{place.english!==place.name&&<span>{place.english}</span>}</h2><p className="panel-description">{place.description}</p>
      <span className="demo-tag">Sample destination</span>
      <div className="visit-list">{visits.filter(v=>v.placeId===place.id&&v.status==='public'&&visibleInYear(v.visitedAt,year)).map(v=><article key={v.id}><time>{dateLabel(v.visitedAt)}</time><h3>{v.title}</h3><p>{v.description}</p>{v.photos.map(photo=><img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy"/>)}{v.storyIds.filter(id=>storyById[id]&&visibleInYear(storyById[id].date,year)).map(id=><button className="text-button" key={id} onClick={()=>patch({activeStoryId:id,selectedPlaceId:null})}>Read story <ArrowRight size={14}/></button>)}</article>)}</div>
    </>:story?<>
      <button className="text-button panel-return" onClick={()=>patch({activeStoryId:null})}><ArrowLeft size={13}/> Back to this world</button>
      <time className="panel-kicker">{dateLabel(story.date)}</time><h2>{story.title}</h2><p className="serif subtitle">{story.subtitle}</p>
      <div className="tag-row">{story.emotionTags.map(t=><span key={t}>{t}</span>)}{story.demo&&<span>Sample story</span>}</div>
      <div className="story-prose">{story.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div>
      <div className="related-links">{story.celestialNodeIds.map(id=><button className="text-button" key={id} onClick={()=>explore(id)}>{nodeById[id].name}<ChevronRight size={14}/></button>)}</div>
      {related.length>1&&<div className="story-pagination"><button disabled={storyIndex<=0} onClick={()=>patch({activeStoryId:related[storyIndex-1]?.id})}><ArrowLeft size={14}/> Previous</button><button disabled={storyIndex<0||storyIndex>=related.length-1} onClick={()=>patch({activeStoryId:related[storyIndex+1]?.id})}>Next <ArrowRight size={14}/></button></div>}
      <Link className="text-button permalink" href={`/stories/${story.id}/`}>Read full story <ArrowRight size={14}/></Link>
    </>:node?.id==='sun'?<AboutProfile/>:node?<>
      <div className="planet-emblem" style={{'--planet-color':themes[node.themeId].color} as React.CSSProperties}><Orbit size={27} strokeWidth={1}/></div>
      <span className="panel-kicker">{themes[node.themeId].label}</span><h2>{node.name}{node.english!==node.name&&<span>{node.english}</span>}</h2><p className="panel-description">{node.description}</p>
      {(node.since??0)>year&&<p className="future-note">Up ahead · {node.since}</p>}
      {node.children?.length?<div className="node-children"><h3>Keep exploring <span>{String(node.children.length).padStart(2,'0')}</span></h3>{node.children.map((child,i)=><button key={child.id} onClick={()=>explore(child.id)}><span className="list-number">{String(i+1).padStart(2,'0')}</span><span>{child.name}{child.english!==child.name&&<small>{child.english}</small>}</span><ArrowRight size={14}/></button>)}</div>:null}
      {node.id==='earth'&&<div className="node-children"><h3>Places on the map <span>DEMO</span></h3>{places.filter(p=>visits.some(v=>v.placeId===p.id&&v.status==='public'&&visibleInYear(v.visitedAt,year))).map(place=><button key={place.id} onClick={()=>patch({selectedPlaceId:place.id})}><Globe2 size={15}/><span>{place.name}<small>{place.english} · {place.country}</small></span><ArrowRight size={14}/></button>)}</div>}
      <div className="story-list"><h3>Stories from this world <span>{String(related.length).padStart(2,'0')}</span></h3>{related.length?related.map(story=><button key={story.id} onClick={()=>patch({activeStoryId:story.id})}><time>{dateLabel(story.date)}</time><span>{story.title}</span><ArrowRight size={14}/></button>):<p className="empty-note">A little space for a story still to come.</p>}</div>
      <span className="demo-note">Some entries are samples; personal notes are labelled separately.</span>
    </>:null}
  </aside>;
}
export default function UniverseApp({initialNode,initialSelected,initialWork}:{initialNode?:string;initialSelected?:string;initialWork?:FleetShipId}) {
  const router=useRouter();
  const {solarExploring,beginExploration,openWork}=useUniverse();
  const state=useUniverse();const {mode,focusedId,selectedId,year,quality,reducedMotion,audioEnabled,introComplete,interfaceVisible,toggleInterface,patch,navigate,explore,back}=state;
  const [searchOpen,setSearchOpen]=useState(false),[query,setQuery]=useState(''),[settingsOpen,setSettingsOpen]=useState(false),[failed,setFailed]=useState(false),[notice,setNotice]=useState('');
  const [sceneReady,setSceneReady]=useState(false);
  const lunarActive=Boolean(lunarLocation(focusedId));
  const immersive=focusedId==='universe'&&mode==='overview'&&!interfaceVisible;
  const searchRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');patch({reducedMotion:media.matches,quality:window.innerWidth<768?'low':'medium'});
    const entryNode=initialNode??new URLSearchParams(window.location.search).get('node');if(entryNode&&(nodeById[entryNode]||entryNode==='works')){explore(entryNode);if(initialSelected&&nodeById[initialSelected])patch({selectedId:initialSelected});}
    if(initialWork){const requested=new URLSearchParams(window.location.search).get('ship');openWork(requested&&isFleetShipId(requested)?requested:initialWork);}
    // Mount WebGL only after the route and device preferences are initialized.
    setSceneReady(true);
    const listener=(e:MediaQueryListEvent)=>patch({reducedMotion:e.matches});media.addEventListener('change',listener);
    const key=(e:KeyboardEvent)=>{
      if(e.key.toLowerCase()==='h'&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!(e.target instanceof HTMLElement&&e.target.closest('input,textarea,[contenteditable=true]'))){toggleInterface();}
      if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setSearchOpen(v=>!v);}
      if(e.key==='Escape'){setSearchOpen(false);setSettingsOpen(false);patch({selectedId:null,activeStoryId:null,selectedPlaceId:null,...(!useUniverse.getState().introComplete?{introComplete:true,interfaceVisible:true}:{})});}
      if(e.altKey&&e.key==='ArrowLeft'){e.preventDefault();back();}
    };window.addEventListener('keydown',key);return()=>{media.removeEventListener('change',listener);window.removeEventListener('keydown',key);};
  },[patch,back,explore,toggleInterface,initialNode,initialSelected,initialWork,openWork]);
  useEffect(()=>{if(searchOpen)searchRef.current?.focus();},[searchOpen]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4000);return()=>clearTimeout(timer);},[notice]);
  const fallback=<SceneFallback/>;
  const fleetResult=fleetShips.filter(ship=>`${ship.name} ${ship.role} My Works`.toLowerCase().includes(query.toLowerCase()));
  const result=nodes.filter(n=>n.id!=='universe'&&`${n.name} ${n.english}`.toLowerCase().includes(query.toLowerCase())).slice(0,12);
  async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setNotice('Full screen isn’t available here. Try your browser’s full-screen option.');}}
  return <main className={`universe-app ${selectedId?'with-panel':''} ${reducedMotion?'reduced-motion':''} ${immersive?'interface-hidden':''} ${focusedId==='sun'?'sun-view':''} ${lunarActive?'knowledge-view':''} ${mode==='works'?'works-view':''}`} >
    <a className="skip-link" href="#universe-header">Skip to navigation</a>
    <div className="cosmic-background" aria-hidden="true"><div className="nebula nebula-one"/><div className="nebula nebula-two"/><div className="dust"/></div>
    <div className="scene-container" aria-label="Interactive 3D personal universe">{failed?fallback:sceneReady?<SceneBoundary fallback={fallback}><Scene onError={()=>setFailed(true)}/></SceneBoundary>:null}</div>
    <div className="vignette" aria-hidden="true"/>
    {focusedId==='universe'&&mode==='overview'&&<button className="interface-toggle" aria-label={interfaceVisible?'Hide navigation and introduction':'Show navigation and introduction'} aria-expanded={interfaceVisible} aria-controls="universe-header" title="Show or hide the interface (H)" onClick={()=>toggleInterface()}>{interfaceVisible?<X size={17}/>:<Menu size={17}/>}</button>}
    {immersive&&<div className="immersive-hint">{introComplete?'Drag to orbit · Scroll to zoom':'A little closer…'}<span>{introComplete?'Solar system · Artistically scaled':'Press Esc to skip'}</span></div>}
    <header id="universe-header" className="site-header"><button className="brand" onClick={()=>navigate('overview')} aria-label="My Universe — Back to Explore"><span className="brand-icon"><Orbit size={28} strokeWidth={1}/></span><span>MY UNIVERSE<small>THE PERSONAL WORLD OF JIAHONG CHEN</small></span></button>
      <nav className="main-nav" aria-label="Main navigation">{navigation.map(item=>{const active=item.id==='about'?focusedId==='sun':focusedId!=='sun'&&mode===item.id;return <button key={item.id} className={active?'active':''} aria-current={active?'page':undefined} onClick={()=>{if(item.id==='about'){router.push(planetHref('sun'));}else if(item.id==='works'){router.push('/works/');}else navigate(item.id);}}>{item.label}</button>;})}</nav>
      <div className="header-actions"><button className="icon-button" aria-label="Search this universe" onClick={()=>setSearchOpen(true)}><Search size={17}/></button><span className="action-divider"/><button className={`icon-button ${audioEnabled?'enabled':''}`} aria-label={audioEnabled?'Mute ambient audio':'Enable ambient audio'} aria-pressed={audioEnabled} onClick={()=>{if(typeof AudioContext==='undefined'){setNotice('Ambient audio isn’t available in this browser.');return;}patch({audioEnabled:!audioEnabled});}}>{audioEnabled?<Volume2 size={17}/>:<VolumeX size={17}/>}</button><button className="icon-button" aria-label="Visual settings" onClick={()=>setSettingsOpen(v=>!v)}><Settings2 size={17}/></button><button className="icon-button fullscreen-button" aria-label="Toggle full screen" onClick={toggleFullscreen}><Maximize size={16}/></button></div>
    </header>
    {focusedId==='universe'&&mode!=='timeline'?<section className={`hero ${solarExploring?'exploring':''}`}><div className="eyebrow hero-eyebrow"><span className="live-dot"/> JIAHONG CHEN / A PERSONAL SPACE</div><h1>Welcome to<br/><span className="serif">my universe.</span></h1><p className="hero-description"><span className="hero-name">I’m Jiahong Chen.</span><br/>A few things I’m learning, places I’m discovering,<br/>and stories I’m collecting along the way.</p><button className="explore-button" onClick={beginExploration}><Compass size={17}/><span>Start exploring</span><ArrowRight size={17}/></button></section>:<section className="section-heading"><button className="text-button" onClick={back}><ArrowLeft size={14}/> Back</button><div className="eyebrow">{mode==='timeline'?'TRACES THROUGH TIME':nodeById[focusedId]?.english.toUpperCase()}</div><h1>{mode==='timeline'?'Through the years':focusedId==='sun'?'About Me':nodeById[focusedId]?.name}</h1><p>{mode==='timeline'?'Move through the years and revisit the stories along the way.':nodeById[focusedId]?.description}</p>{mode==='earth'&&<span className="demo-tag">Sample places · Drag to turn the globe</span>}</section>}
    {mode==='works'?<WorksExplorer/>:lunarActive?<LunarExplorer onSearch={()=>setSearchOpen(true)}/>:<StoryPanel/>}
    {mode==='timeline'&&<section className="timeline-panel glass"><div className="panel-top"><span className="eyebrow">LIFE IN ORBIT</span><span>{year}</span></div><h2>Moments along the way</h2><div className="timeline-stories">{stories.filter(s=>s.status==='public'&&visibleInYear(s.date,year)).sort((a,b)=>dateLabel(b.date).localeCompare(dateLabel(a.date))).map(story=><button key={story.id} onClick={()=>{explore(story.celestialNodeIds[0]);patch({activeStoryId:story.id});}}><time>{dateLabel(story.date)}</time><span>{story.title}<small>{story.emotionTags.join(' / ')} · Sample</small></span><ArrowRight size={14}/></button>)}</div></section>}
    <div className={`year-control ${mode==='timeline'?'expanded':''}`}><label htmlFor="year-slider">{year}<span>{year>2026?'Up ahead':''}</span></label><input id="year-slider" aria-label="Choose a year" type="range" min="2018" max="2028" value={year} onChange={e=>{const nextYear=Number(e.target.value);patch({year:nextYear,activeStoryId:state.activeStoryId&&visibleInYear(storyById[state.activeStoryId].date,nextYear)?state.activeStoryId:null,selectedPlaceId:null});}}/><div className="year-scale"><span>2018</span><span>2028</span></div></div>
    {solarExploring&&focusedId==='universe'&&<div className="solar-explore-caption">Pick a planet. See where it takes you.<span>Sun · About Me / Moon · Learning / Earth · Travel</span></div>}

    {settingsOpen&&<div className="settings-popover glass"><div className="panel-top"><h2>Visual settings</h2><button className="icon-button" aria-label="Close settings" onClick={()=>setSettingsOpen(false)}><X size={16}/></button></div><label>Quality</label><div className="quality-options">{(['low','medium','high'] as const).map((q,i)=><button key={q} className={quality===q?'active':''} onClick={()=>patch({quality:q})}>{['Low','Medium','High'][i]}{quality===q&&<Check size={12}/>}</button>)}</div><button className="setting-toggle" role="switch" aria-checked={reducedMotion} onClick={()=>patch({reducedMotion:!reducedMotion})}><span>Reduce motion<small>Skip camera animations and pause rotation</small></span><span className={`toggle ${reducedMotion?'on':''}`}/></button><p>Mobile uses low quality by default. Press Esc to stop a camera move.</p></div>}
    {searchOpen&&<div className="modal-backdrop" onClick={()=>setSearchOpen(false)}><section className="search-modal glass" role="dialog" aria-modal="true" aria-label="Search this universe" onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Tab'){const focusable=e.currentTarget.querySelectorAll<HTMLElement>('button,input');const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}><div className="search-input"><Search size={18}/><input ref={searchRef} placeholder="Find a planet, a language, an idea…" aria-label="Search by name" value={query} onChange={e=>setQuery(e.target.value)}/><button className="icon-button" aria-label="Close search" onClick={()=>setSearchOpen(false)}><X size={17}/></button></div><div className="search-results">{fleetResult.map(ship=><button key={ship.id} onClick={()=>{openWork(ship.id);setSearchOpen(false);setQuery('');}}><Compass size={17}/><span>{ship.name}<small>{ship.role}</small></span><ArrowRight size={15}/></button>)}{result.length?result.map(n=><button key={n.id} onClick={()=>{explore(n.id);setSearchOpen(false);setQuery('');}}><Orbit size={17}/><span>{n.name}<small>{ancestors(n.id).slice(1).map(a=>a.english).join(' / ')}</small></span><ArrowRight size={15}/></button>):!fleetResult.length?<p>Nothing here just yet. Try another search.</p>:null}</div><div className="search-footer">Search notes, stories, and worlds <kbd>Esc to close</kbd></div></section></div>}
    {notice&&<div className="toast" role="status">{notice}</div>}
    <AmbientAudio/>
  </main>;
}
