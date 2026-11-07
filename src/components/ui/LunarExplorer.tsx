'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowUpRight, ChevronRight, Cpu, Globe2, Search, X, BookOpen, Radio, ScanLine } from 'lucide-react';
import { useUniverse } from '@/stores/universe';
import { stories, storyById } from '@/data/stories';
import { nodeById } from '@/data/universe';
import { dateLabel } from '@/lib/content';
import { chamberPositions, lunarBases, lunarLocation } from '@/lib/lunar';

function Equipment({ x, y, variant }: { x: number; y: number; variant: number }) {
  return <g className="base-equipment" transform={`translate(${x} ${y})`} aria-hidden="true">
    {variant % 2 === 0 ? <>
      {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${i * 30} 0)`}><rect width="22" height="34" rx="2"/><path d="M4 7h14M4 13h14M4 19h9"/><circle cx="16" cy="27" r="1.5"/></g>)}
      <path d="M-8 42h132m-124 0v9m114-9v9"/>
    </> : <>
      <rect width="116" height="22" rx="3"/><path d="M10 6h22v10H10zm37 0h22v10H47zm37 0h22v10H84z"/>
      {[16, 53, 90].map(x => <g key={x}><rect x={x} y="29" width="12" height="10" rx="3"/><path d={`M${x + 6} 22v7`}/></g>)}
    </>}
  </g>;
}
function BasePlan({ baseId }: { baseId: string }) {
  const { explore, back } = useUniverse();
  const rooms = nodeById[baseId].children ?? [];
  return <div className="base-plan" role="region" aria-label={`${nodeById[baseId].name} base floor plan`}>
    <svg viewBox="0 77 1000 603" className="base-blueprint" aria-hidden="true">
      <defs><pattern id="lunar-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="currentColor" strokeWidth=".4"/></pattern></defs>
      <rect x="12" y="12" width="976" height="656" fill="url(#lunar-grid)" opacity=".22"/>
      <g className="base-survey"><circle cx="500" cy="340" r="295"/><circle cx="500" cy="340" r="230"/><path d="M500 26v50m0 528v50M26 340h50m848 0h50M50 50h30m-15-15v30m870-15h-30m15-15v30"/></g>
      <g className="base-corridors"><path d="M390 197H610M390 483H610M500 197V565M250 292v95M750 292v95"/><path d="M390 197H610M390 483H610M500 197V565M250 292v95M750 292v95" className="corridor-centre"/></g>
      <g className="base-hub"><path d="M456 283h88l35 57-35 57h-88l-35-57z"/><circle cx="500" cy="340" r="26"/><circle cx="500" cy="340" r="12"/><path d="M500 300v14m0 52v14m-40-40h14m52 0h14"/><text x="500" y="421">CENTRAL LINK</text></g>
      {rooms.map((room, i) => {
        const p = chamberPositions[i];
        return <g key={room.id} className="base-room-shell">
          <rect x={p.x * 10} y={p.y * 6.8} width={p.w * 10} height={p.h * 6.8} rx="14"/>
          <rect x={p.x * 10 + 9} y={p.y * 6.8 + 9} width={p.w * 10 - 18} height={p.h * 6.8 - 18} rx="8" className="room-inner-wall"/>
          <Equipment x={p.x * 10 + 25} y={p.y * 6.8 + p.h * 6.8 - 62} variant={i}/>
          <path d={`M${p.x * 10 + p.w * 10 - 26} ${p.y * 6.8 + 22}v28m-6-28v28`}/>
        </g>;
      })}
      <g className="base-survey"><text x="36" y="670">LUNAR SURFACE / PLAN VIEW</text><text x="945" y="100">N ↑</text><path d="M800 630h150m-150-5v10m75-10v10m75-10v10"/><text x="800" y="618">SCHEMATIC / NOT TO SCALE</text></g>
    </svg>
    {rooms.map((room, i) => {
      const p = chamberPositions[i];
      return <button key={room.id} className="base-chamber" style={{ left: `${p.x}%`, top: `${(p.y * 6.8 - 77) / 603 * 100}%`, width: `${p.w}%`, height: `${p.h * 6.8 / 603 * 100}%` }} onClick={() => explore(room.id)} aria-label={`Explore ${room.name} chamber`}>
        <span className="chamber-code">{baseId === 'it' ? 'LAB' : 'COMMS'} / 0{i + 1}<span className="chamber-light"/></span>
        <strong>{room.id==='ai'?'AI':room.id==='cloud'?'Cloud':room.name}</strong><span className="chamber-caption">{room.children?.length ?? 0} {room.children?.length ? 'workstations' : 'field records'}</span>
        <ArrowUpRight size={17} className="chamber-arrow"/>
      </button>;
    })}
    <button className="lunar-back lunar-map-return" onClick={back}><ArrowLeft size={14}/> Moon surface</button>
  </div>;
}
function Workroom({ id }: { id: string }) {
  const { explore, patch } = useUniverse();
  const node = nodeById[id];
  const children = node.children ?? [];
  const records = stories.filter(story => story.status === 'public' && story.celestialNodeIds.includes(id));
  return <section className="lunar-workroom" aria-label={`${node.name} workstations`}>
    <div className="workroom-door" aria-hidden="true"><span/> AIRLOCK / {node.name.toUpperCase()} <span/></div>
    <div className="workroom-overview"><span className="eyebrow">{children.length ? 'CHOOSE A WORKSTATION' : 'RESEARCH STATION'}</span><h2>{node.name}</h2><p>{node.description}</p></div>
    {children.length > 0 && <div className="workstation-grid">{children.map((child, i) => <button key={child.id} className="lunar-workstation" onClick={() => explore(child.id)}>
      <span className="station-number">DESK / {String(i + 1).padStart(2, '0')}</span>
      <span className="station-monitor" aria-hidden="true"><span/><span/><span/></span>
      <strong>{child.name}</strong><small>{child.children?.length ? `${child.children.length} connected station${child.children.length === 1 ? '' : 's'}` : 'Open station'}</small><ArrowUpRight size={16}/>
    </button>)}</div>}
    <div className="lunar-records"><h3><BookOpen size={14}/> Field notes <span>{String(records.length).padStart(2, '0')}</span></h3>
      {records.length ? records.map(story => <button key={story.id} onClick={() => patch({ activeStoryId: story.id })}><span><time>{dateLabel(story.date)} / FIELD NOTE</time><strong>{story.title}</strong><small>{story.summary}</small></span><ArrowUpRight size={18}/></button>) : <p>No field notes here yet. This station is ready for future entries.</p>}
    </div>
  </section>;
}
function FieldNote() {
  const { activeStoryId, patch } = useUniverse();
  const story = activeStoryId ? storyById[activeStoryId] : null;
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!story) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => { previous?.focus(); };
  }, [story]);
  if (!story) return null;
  return createPortal(<div className="lunar-note-backdrop" onClick={() => patch({ activeStoryId: null })}>
    <article ref={ref} className="lunar-note glass" role="dialog" aria-modal="true" aria-label={story.title} onClick={event => event.stopPropagation()} onKeyDown={event => {
      if (event.key === 'Escape') { event.stopPropagation(); patch({ activeStoryId: null }); }
      if (event.key === 'Tab') {
        const elements = ref.current?.querySelectorAll<HTMLElement>('button, a[href]');
        if (!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}>
      <button ref={closeRef} className="icon-button lunar-note-close" aria-label="Close field note" onClick={() => patch({ activeStoryId: null })}><X size={20}/></button>
      <span className="eyebrow">FIELD NOTE / {dateLabel(story.date)}</span><h2>{story.title}</h2><p className="lunar-note-subtitle">{story.subtitle}</p><span className="demo-tag">Personal note</span>
      <div className="story-prose">{story.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div><Link href={`/stories/${story.id}/`}>Open reading page <ArrowUpRight size={14}/></Link>
    </article>
  </div>, document.body);
}
export default function LunarExplorer({ onSearch }: { onSearch: () => void }) {
  const { focusedId, explore, navigate, back, patch } = useUniverse();
  const location = lunarLocation(focusedId);
  if (!location) return null;
  const { trail, base, level, node } = location;
  const surfaceNotes=stories.filter(story=>story.status==='public'&&story.celestialNodeIds.includes('knowledge'));
  return <section className={`lunar-explorer ${level === 0 ? 'on-surface' : 'inside-base'}`} aria-label="Lunar knowledge explorer" style={{ '--base-accent': base?.accent ?? '#b9cfda' } as CSSProperties}>
    <div className="lunar-topbar"><nav aria-label="Lunar exploration path"><button onClick={() => navigate('overview')}>Universe</button>{trail.map((step, i) => <span key={step.id}><ChevronRight size={12}/><button aria-current={i === trail.length - 1 ? 'page' : undefined} onClick={() => explore(step.id)}>{step.id === 'knowledge' ? 'Moon' : step.name}</button></span>)}</nav><button className="lunar-find" onClick={onSearch}><Search size={14}/> Quick Find</button></div>
    {level === 0 ? <>
      <div className="lunar-surface-heading"><span className="eyebrow">KNOWLEDGE & GROWTH / LUNAR SURFACE</span><h1>My Knowledge & Skills</h1><p>Full-stack development, cloud infrastructure,<br/>AI, and four languages. Choose a base to explore.</p></div>
      <div className="lunar-landing-strip"><span><ScanLine size={14}/> SELECT A LANDING SITE</span>{lunarBases.map(site => <button key={site.id} onClick={() => explore(site.id)}>{site.id === 'it' ? <Cpu size={16}/> : <Globe2 size={16}/>}<span><small>BASE / {site.code}</small>{site.name}</span><ArrowUpRight size={15}/></button>)}</div>
      <div className="lunar-surface-caption"><Radio size={13}/> TWO BASES. ONE OPEN NOTEBOOK.<span>Drag to orbit · Select a landing beacon</span>{surfaceNotes[0]&&<button onClick={()=>patch({activeStoryId:surfaceNotes[0].id})}>Open lunar field note ↗</button>}</div>
    </> : <div className={`lunar-base-deck ${level===1?'is-floorplan':'is-workroom'}`} key={base?.id}>
      {level>1&&<header className="lunar-base-header"><div><span className="eyebrow">MOON / {base?.id === 'it' ? 'RESEARCH FACILITY' : 'COMMUNICATIONS FACILITY'}</span><h1>{node.name}</h1><p>Explore the workstations, one idea at a time.</p></div><button className="lunar-back" onClick={back}><ArrowLeft size={14}/> Step back</button></header>}
      {level === 1 && base ? <div className="lunar-map-scroll"><BasePlan baseId={base.id}/></div> : <Workroom id={focusedId}/>}
      {level>1&&<div className="lunar-deck-footer"><span><span className="chamber-light"/> {base?.name.toUpperCase()} / WORKSTATION VIEW</span><span>Choose a room. Follow your curiosity.</span></div>}
    </div>}
    <FieldNote/>
  </section>;
}
