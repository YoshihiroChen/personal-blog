'use client';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Billboard, Html } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { fleetShips, solarFleetShips, type FleetShip } from '@/data/works';
import { fleetTextures } from '@/lib/fleet-textures';
import { ignoreOrbitRaycast } from '@/lib/orbits';
import { useUniverse } from '@/stores/universe';

function hull(kind: FleetShip['kind'], id: FleetShip['id']) {
  const shape=new THREE.Shape();
  const width=kind==='research'?.8:kind==='communications'?.95:1.15;
  shape.moveTo(0,2.15);shape.lineTo(.38,1.4);shape.lineTo(.5,.35);shape.lineTo(width,-.7);shape.lineTo(width*.85,-1.1);shape.lineTo(.61,-.95);shape.lineTo(.55,-1.75);shape.lineTo(-.55,-1.75);shape.lineTo(-.61,-.95);shape.lineTo(-width*.85,-1.1);shape.lineTo(-width,-.7);shape.lineTo(-.5,.35);shape.lineTo(-.38,1.4);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.22,steps:1,bevelEnabled:true,bevelSize:.065,bevelThickness:.06,bevelSegments:2});
  geometry.rotateX(Math.PI/2);geometry.translate(0,.05,0);
  const proportions: Partial<Record<FleetShip['id'],[number,number,number]>> = {
    research:[1.1,1,1], 'frontend-platform':[1.25,.85,.85],
    'learning-platform':[.9,1,1.2], 'django-service':[1.2,1.3,.95],
    'rag-assistant':[.85,1,1.15], 'booking-system':[1.15,1,1.1], 'personal-blog':[1,1,.9],
  };
  geometry.scale(...(proportions[id]??[1,1,1]));
  const positions=geometry.getAttribute('position'),normals=geometry.getAttribute('normal'),uvs=new Float32Array(positions.count*2);
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
    if(Math.abs(normals.getY(i))>.5){uvs[i*2]=(x+1.25)/2.5;uvs[i*2+1]=(z+1.85)/4.1;}
    else{uvs[i*2]=(Math.abs(normals.getX(i))>.5?z/4.1:x/2.5)+.5;uvs[i*2+1]=(y+.25)/.4;}
  }
  geometry.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
  return geometry;
}
function PanelWing({ side, warm=false, map }: { side: number; warm?: boolean; map: THREE.Texture }) {
  return <group position={[side*1.04,.12,-.45]} rotation={[0,0,side*.08]}>
    <mesh position={[-side*.2,-.06,0]}><boxGeometry args={[.5,.06,.09]}/><meshStandardMaterial color="#758894" metalness={.5} roughness={.55}/></mesh>
    <mesh><boxGeometry args={[.48,.045,1.22]}/><meshStandardMaterial map={map} color="#ffffff" metalness={.55} roughness={.46}/></mesh>
    {[-.4,-.2,0,.2,.4].map(z=><mesh key={z} position={[0,.026,z]}><boxGeometry args={[.45,.008,.012]}/><meshBasicMaterial color={warm?'#a98b64':'#648da7'}/></mesh>)}
    <mesh position={[0,.026,0]}><boxGeometry args={[.012,.008,1.2]}/><meshBasicMaterial color={warm?'#a98b64':'#648da7'}/></mesh>
    {[-.245,.245].map(x=><mesh key={x} position={[x,0,0]}><boxGeometry args={[.016,.06,1.24]}/><meshStandardMaterial color="#9cabb1" metalness={.55} roughness={.5}/></mesh>)}
  </group>;
}
function Engine({ x, accent, surface }: { x: number; accent: string; surface: THREE.Texture }) {
  return <group position={[x,-.05,-1.62]}>
    <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.15,.19,.55,12]}/><meshStandardMaterial color="#415260" bumpMap={surface} bumpScale={.008} roughnessMap={surface} metalness={.7} roughness={.7}/></mesh>
    <mesh position={[0,0,-.29]}><torusGeometry args={[.125,.03,6,12]}/><meshStandardMaterial color="#b8bab0" metalness={.55} roughness={.5}/></mesh>
    <mesh position={[0,0,-.31]}><circleGeometry args={[.11,12]}/><meshBasicMaterial color={accent} side={THREE.DoubleSide}/></mesh>
    <mesh position={[0,0,-.56]} rotation={[-Math.PI/2,0,0]}><coneGeometry args={[.095,.48,10]}/><meshBasicMaterial color={accent} transparent opacity={.22} depthWrite={false}/></mesh>
  </group>;
}
function DeckDetails({ low, accent }: { low: boolean; accent: string }) {
  const bolts=useRef<THREE.InstancedMesh>(null);
  const points=useMemo(()=>[-1,1].flatMap(side=>(low?[-1.1,.1,.9]:[-1.25,-.85,-.4,.15,.65,1.1]).map(z=>new THREE.Vector3(side*.42,.125,z))),[low]);
  useLayoutEffect(()=>{
    if(!bolts.current)return;
    const matrix=new THREE.Matrix4();
    points.forEach((point,index)=>bolts.current!.setMatrixAt(index,matrix.makeTranslation(point.x,point.y,point.z)));
    bolts.current.instanceMatrix.needsUpdate=true;
  },[points]);
  return <group>
    <instancedMesh ref={bolts} args={[undefined,undefined,points.length]} raycast={ignoreOrbitRaycast}>
      <cylinderGeometry args={[.013,.013,.012,6]}/><meshStandardMaterial color="#cad0c9" metalness={.7} roughness={.5}/>
    </instancedMesh>
    {[-1,1].map(side=><group key={side}>
      <mesh position={[side*.3,.13,-1.24]}><boxGeometry args={[.15,.025,.21]}/><meshStandardMaterial color="#526975" roughness={.72} metalness={.4}/></mesh>
      <mesh position={[side*.3,.148,-1.24]}><boxGeometry args={[.055,.016,.035]}/><meshStandardMaterial color="#bcc6c8" roughness={.55} metalness={.65}/></mesh>
      <mesh position={[side*.28,.13,.71]}><boxGeometry args={[.11,.018,.32]}/><meshStandardMaterial color="#263c48" roughness={.8} metalness={.4}/></mesh>
      {!low&&[-.09,0,.09].map(z=><mesh key={z} position={[side*.28,.146,.71+z]} rotation={[.18,0,0]}><boxGeometry args={[.1,.014,.035]}/><meshStandardMaterial color="#8398a3" roughness={.6} metalness={.55}/></mesh>)}
      <mesh position={[side*.74,.182,-.73]} rotation={[0,side*.55,0]}><boxGeometry args={[.045,.008,.48]}/><meshBasicMaterial color={accent}/></mesh>
    </group>)}
    {!low&&[-.17,0,.17].map(x=><mesh key={x} position={[x,.37,-.101]} rotation={[-.15,0,0]}><boxGeometry args={[.012,.08,.012]}/><meshStandardMaterial color="#344752" metalness={.55} roughness={.5}/></mesh>)}
  </group>;
}
/** Mission equipment gives each project its own silhouette without remote assets. */
function ResearchEquipment({ship,solar}:{ship:FleetShip;solar:THREE.Texture}) {
  const metal=<meshStandardMaterial color="#b5c7ce" metalness={.65} roughness={.48}/>;
  const light=<meshBasicMaterial color={ship.accent}/>;
  const wingScale=ship.id==='frontend-platform'?1.3:ship.id==='rag-assistant'?.7:1;
  return <group>
    <group scale={[wingScale,1,ship.id==='learning-platform'?1.25:.85]}>
      <PanelWing side={-1} map={solar}/><PanelWing side={1} map={solar}/>
    </group>
    {ship.id==='research'&&[-1,1].map(side=><group key={side} position={[side*.7,.22,.15]}>
      <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.19,.19,1.25,12]}/>{metal}</mesh>
      <mesh position={[0,0,.64]}><circleGeometry args={[.14,12]}/>{light}</mesh>
    </group>)}
    {ship.id==='frontend-platform'&&[-1,1].map(side=><group key={side} position={[side*.68,.3,.65]} rotation={[0,side*.3,0]}>
      <mesh><boxGeometry args={[.5,.12,1.25]}/>{metal}</mesh>
      <mesh position={[0,.07,0]}><boxGeometry args={[.35,.02,.9]}/>{light}</mesh>
    </group>)}
    {ship.id==='learning-platform'&&[-1,1].map(side=><group key={side} position={[side*.65,.35,.3]}>
      <mesh><boxGeometry args={[.36,.45,1.9]}/>{metal}</mesh>
      {[-.5,0,.5].map(z=><mesh key={z} position={[0,.24,z]}><boxGeometry args={[.3,.025,.16]}/>{light}</mesh>)}
    </group>)}
    {ship.id==='django-service'&&<group position={[0,.55,.35]}>
      {[0,.24,.48].map(y=><mesh key={y} position={[0,y,0]}><boxGeometry args={[.85,.16,.85]}/>{metal}</mesh>)}
      <mesh position={[0,.6,0]}><octahedronGeometry args={[.22]}/>{light}</mesh>
    </group>}
    {ship.id==='rag-assistant'&&<group position={[0,.75,.35]}>
      <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.55,.055,8,32]}/>{metal}</mesh>
      <mesh rotation={[0,.5,0]}><torusGeometry args={[.43,.035,8,28]}/>{light}</mesh>
      <mesh><icosahedronGeometry args={[.23,0]}/><meshStandardMaterial color={ship.accent} emissive={ship.accent} emissiveIntensity={.4} wireframe/></mesh>
    </group>}
    {ship.id==='booking-system'&&[-1,0,1].map(side=><group key={side} position={[side*.65,.48,.25]}>
      <mesh><cylinderGeometry args={[.18,.22,.55,8]}/>{metal}</mesh>
      <mesh position={[0,.32,0]}><sphereGeometry args={[.12,10,8]}/>{light}</mesh>
      {side!==0&&<mesh position={[-side*.3,0,0]}><boxGeometry args={[.6,.06,.06]}/>{metal}</mesh>}
    </group>)}
    {ship.id==='personal-blog'&&<group position={[0,.72,.3]}>
      <mesh><sphereGeometry args={[.3,16,12]}/><meshStandardMaterial color="#607fc0" emissive={ship.accent} emissiveIntensity={.2} metalness={.4} roughness={.3}/></mesh>
      {[0,1,2].map(i=><group key={i} rotation={[.4+i*.65,i*.7,0]}>
        <mesh><torusGeometry args={[.49+i*.13,.025,6,36]}/>{light}</mesh>
        <mesh position={[.49+i*.13,0,0]}><sphereGeometry args={[.075,8,6]}/>{metal}</mesh>
      </group>)}
    </group>}
  </group>;
}
function Ship({ ship, overview, groupHovered=false }: { ship: FleetShip; overview: boolean; groupHovered?: boolean }) {
  const ref=useRef<THREE.Group>(null);
  const [hovered,setHovered]=useState(false);
  const reduced=useUniverse(state=>state.reducedMotion),quality=useUniverse(state=>state.quality),openWork=useUniverse(state=>state.openWork),selected=useUniverse(state=>state.selectedWorkId===ship.id);
  const geometry=useMemo(()=>hull(ship.kind,ship.id),[ship.kind,ship.id]);
  const surface=useMemo(()=>fleetTextures(ship.kind,quality==='low'),[ship.kind,quality]);
  useEffect(()=>()=>{geometry.dispose();document.body.style.cursor='auto';},[geometry]);
  useFrame(({clock},delta)=>{
    if(!ref.current)return;
    // Bounded drift maintains a readable formation and never crosses planetary orbits.
    const phase=Number(ship.code.slice(-3))*1.7;
    ref.current.position.y=ship.position[1]+(reduced?0:Math.sin(clock.elapsedTime*.18+phase)*.09);
    ref.current.rotation.z=reduced?0:Math.sin(clock.elapsedTime*.12+phase)*.018;
    const target=ship.scale*(!overview&&hovered?1.045:1);
    ref.current.scale.lerp(new THREE.Vector3(target,target,target),reduced?1:Math.min(1,delta*7));
  });
  const enter=(event:ThreeEvent<PointerEvent>)=>{event.stopPropagation();setHovered(true);document.body.style.cursor='pointer';};
  const leave=()=>{setHovered(false);document.body.style.cursor='auto';};
  const open=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();openWork(ship.id);};
  return <group ref={ref} position={ship.position} scale={ship.scale} rotation={[0,-.25,0]} onPointerOver={overview?undefined:enter} onPointerOut={overview?undefined:leave} onClick={overview?undefined:open}>
    <mesh><boxGeometry args={[2.1,.95,4.2]}/><meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false}/></mesh>
    <mesh geometry={geometry}><meshStandardMaterial map={surface.map} bumpMap={surface.packed} bumpScale={.025} roughnessMap={surface.packed} metalnessMap={surface.packed} color="#ffffff" metalness={.65} roughness={.8} emissive={ship.accent} emissiveIntensity={(groupHovered||hovered||(!overview&&selected)) ? .045 : .005}/></mesh>
    <DeckDetails low={quality==='low'} accent={ship.accent}/>
    <mesh position={[0,.14,-.1]}><boxGeometry args={[.43,.16,2.7]}/><meshStandardMaterial map={surface.map} bumpMap={surface.packed} bumpScale={.012} roughnessMap={surface.packed} color="#e1e2dc" metalness={.4} roughness={.85}/></mesh>
    <mesh position={[0,.24,.65]}><boxGeometry args={[.055,.025,1.1]}/><meshBasicMaterial color={ship.accent}/></mesh>
    <mesh position={[0,.31,-.45]}><boxGeometry args={[.64,.23,.62]}/><meshStandardMaterial color="#526a78" metalness={.6} roughness={.45}/></mesh>
    <mesh position={[0,.48,-.48]}><boxGeometry args={[.42,.12,.38]}/><meshStandardMaterial map={surface.map} bumpMap={surface.packed} bumpScale={.008} roughnessMap={surface.packed} color="#d5dedf" metalness={.5} roughness={.75}/></mesh>
    <mesh position={[0,.37,-.12]} rotation={[-.15,0,0]}><boxGeometry args={[.51,.075,.025]}/><meshBasicMaterial color={ship.accent}/></mesh>
    {[-1,1].map(side=><group key={side}>
      <Engine x={side*.55} accent={ship.accent} surface={surface.packed}/>
      <mesh position={[side*.44,.14,.5]}><boxGeometry args={[.055,.065,1.15]}/><meshStandardMaterial color="#536976" metalness={.6} roughness={.5}/></mesh>
      <mesh position={[side*.83,.1,-.73]} rotation={[0,side*.55,0]}><boxGeometry args={[.13,.12,.72]}/><meshStandardMaterial color="#bec2bc" metalness={.45} roughness={.5}/></mesh>
      <mesh position={[side*.46,.22,.99]}><sphereGeometry args={[.035,8,6]}/><meshBasicMaterial color={ship.accent}/></mesh>
      {quality!=='low'&&[-.95,-.64,-.33].map(z=><mesh key={z} position={[side*.32,.21,z]}><boxGeometry args={[.10,.035,.045]}/><meshBasicMaterial color="#8aa1ac"/></mesh>)}
    </group>)}
    {ship.kind==='flagship'&&<>
      <mesh position={[0,.52,-.9]}><boxGeometry args={[.09,.46,.11]}/><meshStandardMaterial color="#b8b9aa" metalness={.45} roughness={.55}/></mesh>
      <mesh position={[0,.75,-.9]}><boxGeometry args={[.38,.035,.07]}/><meshStandardMaterial color="#d1c9ae" metalness={.5} roughness={.5}/></mesh>
      <mesh position={[0,.52,.15]}><sphereGeometry args={[.16,12,8,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#61889c" metalness={.45} roughness={.3}/></mesh>
      {[-1,1].map(side=><mesh key={side} position={[side*.32,.18,-1.25]}><boxGeometry args={[.16,.10,.28]}/><meshStandardMaterial color="#d2c6a8" roughness={.7}/></mesh>)}
    </>}
    {ship.kind==='research'&&<ResearchEquipment ship={ship} solar={surface.solar}/>}
    {ship.kind==='communications'&&<>
      <PanelWing side={-1} warm map={surface.solar}/><PanelWing side={1} warm map={surface.solar}/>
      <group position={[0,.49,.35]} rotation={[.25,0,-.18]}>
        <mesh position={[0,.14,0]}><cylinderGeometry args={[.025,.05,.3,8]}/><meshStandardMaterial color="#b8b8aa"/></mesh>
        <mesh position={[0,.25,0]}><sphereGeometry args={[.36,20,10,0,Math.PI*2,0,Math.PI*.38]}/><meshStandardMaterial color="#d1c6ae" bumpMap={surface.packed} bumpScale={.002} roughnessMap={surface.packed} side={THREE.DoubleSide} roughness={.75} metalness={.4}/></mesh>
        <mesh position={[0,.6,0]}><cylinderGeometry args={[.008,.008,.25,6]}/><meshStandardMaterial color="#bdbaa9"/></mesh>
        <mesh position={[0,.74,0]}><sphereGeometry args={[.028,8,6]}/><meshBasicMaterial color={ship.accent}/></mesh>
      </group>
      {[-1,1].map(side=><mesh key={side} position={[side*.4,.53,-.9]}><cylinderGeometry args={[.009,.016,.58,6]}/><meshStandardMaterial color="#d7cdb6"/></mesh>)}
    </>}
    {!overview&&ship.id!=='flagship'&&<Html position={[0,.7,2.35]} center wrapperClass="fleet-label-anchor" style={{pointerEvents:'none'}} zIndexRange={[17,0]}>
      <button className={`fleet-label ${hovered||(!overview&&selected)?'is-highlighted':''}`} style={{'--ship-accent':ship.accent} as React.CSSProperties} aria-label={`Open ${ship.name}`} onClick={()=>openWork(ship.id)} onPointerEnter={()=>setHovered(true)} onPointerLeave={leave}>
        <small>{ship.code}</small><strong>{ship.name}</strong><span>{ship.role} ↗</span>
      </button>
    </Html>}
  </group>;
}
export default function Fleet({ overview=false }: { overview?: boolean }) {
  const root=useRef<THREE.Group>(null);
  const [hovered,setHovered]=useState(false);
  const reduced=useUniverse(state=>state.reducedMotion);
  useEffect(()=>()=>{document.body.style.cursor='auto';},[]);
  useFrame((_,delta)=>{
    if(!root.current||!overview)return;
    const target=.52*(hovered?1.055:1);
    root.current.scale.lerp(new THREE.Vector3(target,target,target),reduced?1:Math.min(1,delta*7));
  });
  const enter=(event:ThreeEvent<PointerEvent>)=>{event.stopPropagation();setHovered(true);document.body.style.cursor='pointer';};
  const leave=()=>{setHovered(false);document.body.style.cursor='auto';};
  const open=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();window.location.assign('/works/');};
  return <group ref={root} position={overview?[5.5,2.2,3.5]:[-6.5,0,0]} scale={overview ? .52 : 1} rotation={[0,overview?-.45:0,0]} onPointerOver={overview?enter:undefined} onPointerOut={overview?leave:undefined} onClick={overview?open:undefined}>
    <ambientLight intensity={.7}/><directionalLight position={[-6,8,10]} color="#e4eaf0" intensity={2.3}/>
    {overview&&<mesh position={[0,.25,1.3]}><boxGeometry args={[7.3,2.4,7.5]}/><meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false}/></mesh>}
    {(overview?solarFleetShips:fleetShips).map(ship=><Ship key={ship.id} ship={ship} overview={overview} groupHovered={overview&&hovered}/>)}
    {overview&&hovered&&<Billboard position={[0,.3,1.2]}><mesh raycast={ignoreOrbitRaycast}><ringGeometry args={[3.7,3.74,80]}/><meshBasicMaterial color="#dfcba6" transparent opacity={.45} side={THREE.DoubleSide} depthWrite={false}/></mesh></Billboard>}
    {overview&&<Html position={[0,.2,5.3]} center wrapperClass="fleet-entry-anchor" style={{pointerEvents:'none'}} zIndexRange={[17,0]}>
      <button className={`fleet-entry-label ${hovered?'is-highlighted':''}`} aria-label="Explore My Works" onClick={event=>{event.stopPropagation();window.location.assign('/works/');}} onPointerEnter={()=>setHovered(true)} onPointerLeave={leave}>
        <span>My Works</span><small>IT &amp; language projects</small>
      </button>
    </Html>}
  </group>;
}
