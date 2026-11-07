'use client';
import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight, ChevronRight, Ship, X } from 'lucide-react';
import { fleetShips, fleetShipById, workProjects } from '@/data/works';
import { useUniverse } from '@/stores/universe';

export default function WorksExplorer() {
  const { selectedWorkId, openWork, navigate, patch }=useUniverse();
  const panel=useRef<HTMLElement>(null);
  useEffect(()=>{panel.current?.focus({preventScroll:true});},[selectedWorkId]);
  const ship=selectedWorkId?fleetShipById[selectedWorkId]:null;
  const project=selectedWorkId&&selectedWorkId!=='flagship'?workProjects[selectedWorkId]:null;
  return <section className="works-explorer" aria-label="My Works fleet">
    <div className="works-path"><button onClick={()=>navigate('overview')}><ArrowLeft size={13}/> Universe</button><ChevronRight size={12}/><span>My Works</span></div>
    <div className="works-scene-caption"><span className="eyebrow">JIAHONG CHEN / EXPEDITION FLEET</span><h1>My Works</h1><p>Ideas put into practice.</p></div>
    {ship&&<aside ref={panel} tabIndex={-1} className="works-panel glass" aria-label={selectedWorkId==='flagship'?'About My Works':`${project?.title} details`} style={{'--ship-accent':ship.accent} as React.CSSProperties}>
      <div className="panel-top"><span className="eyebrow">{ship.code} / {selectedWorkId==='flagship'?'FLAGSHIP':project?.category}</span><button className="icon-button" aria-label="Close work details" onClick={()=>patch({selectedWorkId:null})}><X size={17}/></button></div>
      {selectedWorkId==='flagship'?<>
        <span className="works-emblem"><Ship size={27} strokeWidth={1}/></span><h2>Things I’ve made.<br/>Things I’ve put into practice.</h2>
        <p className="works-intro">Welcome aboard. This fleet brings together my IT projects and the things I’ve done with languages — a place for the work itself, the decisions behind it, and what I learned along the way.</p>
        <dl className="works-overview"><div><dt>Built end to end</dt><dd>From an initial idea to deployed services and real users.</dd></div><div><dt>Across disciplines</dt><dd>Full-stack development, cloud infrastructure, AI, and cross-cultural communication.</dd></div></dl>
        <p className="works-note">Explore seven IT projects and a Japanese writing experience. Each ship carries one project, from the work behind it to the results and lessons learned.</p>
      </>:project?<>
        <button className="text-button" onClick={()=>openWork('flagship')}><ArrowLeft size={13}/> Fleet introduction</button><h2>{project.title}</h2><span className="works-status">{project.status??'PROJECT NOTES'}</span><p className="works-intro">{project.intro}</p>
        <div className="works-project-sections">{project.sections.map(section=><section key={section.title}><h3>{section.title}</h3><p>{section.text}</p></section>)}</div>
        {project.url?<p className="works-note">{selectedWorkId==='booking-system'?'Project address (service currently paused): ':'Project website: '}<a href={project.url} target="_blank" rel="noopener noreferrer">{project.url.replace(/^https?:\/\//,'')} ↗</a></p>:<p className="works-note">{selectedWorkId==='communications'?'Based on my 2018 competition and exchange experience.':selectedWorkId==='personal-blog'?'You are exploring this project right now.':'This project is in local development; no public link is available yet.'}</p>}
      </>:null}
    </aside>}
    {!ship&&<div className="works-select-hint">Choose a vessel to see what’s aboard.</div>}
    <nav className="works-dock" aria-label="Select a fleet vessel">{fleetShips.map(item=><button key={item.id} onClick={()=>openWork(item.id)} aria-current={selectedWorkId===item.id?'true':undefined} style={{'--ship-accent':item.accent} as React.CSSProperties}><span className="works-dock-code">{item.code}</span><span>{item.name}<small>{item.role}</small></span><ArrowUpRight size={13}/></button>)}</nav>
  </section>;
}
