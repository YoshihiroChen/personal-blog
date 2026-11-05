'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { fleetShips, type FleetShip } from '@/data/works';
import { useUniverse } from '@/stores/universe';

function hull(kind: FleetShip['id']) {
  const shape=new THREE.Shape();
  const width=kind==='research'?.8:kind==='communications'?.95:1.15;
  shape.moveTo(0,2.15);shape.lineTo(.38,1.4);shape.lineTo(.5,.35);shape.lineTo(width,-.7);shape.lineTo(width*.85,-1.1);shape.lineTo(.61,-.95);shape.lineTo(.55,-1.75);shape.lineTo(-.55,-1.75);shape.lineTo(-.61,-.95);shape.lineTo(-width*.85,-1.1);shape.lineTo(-width,-.7);shape.lineTo(-.5,.35);shape.lineTo(-.38,1.4);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.22,steps:1,bevelEnabled:true,bevelSize:.065,bevelThickness:.06,bevelSegments:2});
  geometry.rotateX(Math.PI/2);geometry.translate(0,.05,0);
  return geometry;
}
function PanelWing({ side, warm=false }: { side: number; warm?: boolean }) {
  return <group position={[side*1.04,.12,-.45]} rotation={[0,0,side*.08]}>
    <mesh position={[-side*.2,-.06,0]}><boxGeometry args={[.5,.06,.09]}/><meshStandardMaterial color="#758894" metalness={.5} roughness={.55}/></mesh>
    <mesh><boxGeometry args={[.48,.045,1.22]}/><meshStandardMaterial color={warm?'#4a3a2d':'#172f43'} metalness={.6} roughness={.4}/></mesh>
    {[-.4,-.2,0,.2,.4].map(z=><mesh key={z} position={[0,.026,z]}><boxGeometry args={[.45,.008,.012]}/><meshBasicMaterial color={warm?'#a98b64':'#648da7'}/></mesh>)}
    <mesh position={[0,.026,0]}><boxGeometry args={[.012,.008,1.2]}/><meshBasicMaterial color={warm?'#a98b64':'#648da7'}/></mesh>
    {[-.245,.245].map(x=><mesh key={x} position={[x,0,0]}><boxGeometry args={[.016,.06,1.24]}/><meshStandardMaterial color="#9cabb1" metalness={.55} roughness={.5}/></mesh>)}
  </group>;
}
function Engine({ x, accent }: { x: number; accent: string }) {
  return <group position={[x,-.05,-1.62]}>
    <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.15,.19,.55,12]}/><meshStandardMaterial color="#415260" metalness={.7} roughness={.4}/></mesh>
    <mesh position={[0,0,-.29]}><torusGeometry args={[.125,.03,6,12]}/><meshStandardMaterial color="#b8bab0" metalness={.55} roughness={.5}/></mesh>
    <mesh position={[0,0,-.31]}><circleGeometry args={[.11,12]}/><meshBasicMaterial color={accent} side={THREE.DoubleSide}/></mesh>
    <mesh position={[0,0,-.56]} rotation={[-Math.PI/2,0,0]}><coneGeometry args={[.095,.48,10]}/><meshBasicMaterial color={accent} transparent opacity={.22} depthWrite={false}/></mesh>
  </group>;
}
function Ship({ ship, overview }: { ship: FleetShip; overview: boolean }) {
  const ref=useRef<THREE.Group>(null);
  const [hovered,setHovered]=useState(false);
  const reduced=useUniverse(state=>state.reducedMotion),quality=useUniverse(state=>state.quality),openWork=useUniverse(state=>state.openWork),selected=useUniverse(state=>state.selectedWorkId===ship.id);
  const geometry=useMemo(()=>hull(ship.id),[ship.id]);
  useEffect(()=>()=>{geometry.dispose();document.body.style.cursor='auto';},[geometry]);
  useFrame(({clock},delta)=>{
    if(!ref.current)return;
    // Bounded drift maintains a readable formation and never crosses planetary orbits.
    const phase=ship.id==='research'?2:ship.id==='communications'?4:0;
    ref.current.position.y=ship.position[1]+(reduced?0:Math.sin(clock.elapsedTime*.18+phase)*.09);
    ref.current.rotation.z=reduced?0:Math.sin(clock.elapsedTime*.12+phase)*.018;
    const target=ship.scale*(hovered?1.045:1);
    ref.current.scale.lerp(new THREE.Vector3(target,target,target),reduced?1:Math.min(1,delta*7));
  });
  const enter=(event:ThreeEvent<PointerEvent>)=>{event.stopPropagation();setHovered(true);document.body.style.cursor='pointer';};
  const leave=()=>{setHovered(false);document.body.style.cursor='auto';};
  const open=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();openWork(ship.id);};
  return <group ref={ref} position={ship.position} scale={ship.scale} rotation={[0,-.25,0]} onPointerOver={enter} onPointerOut={leave} onClick={open}>
    <mesh><boxGeometry args={[2.1,.95,4.2]}/><meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false}/></mesh>
    <mesh geometry={geometry}><meshStandardMaterial color={ship.id==='flagship'?'#a3a9a5':'#80929d'} metalness={.55} roughness={.48} emissive={ship.accent} emissiveIntensity={(hovered||(!overview&&selected)) ? .1 : .015}/></mesh>
    <mesh position={[0,.14,-.1]}><boxGeometry args={[.43,.16,2.7]}/><meshStandardMaterial color="#c3c4b7" metalness={.35} roughness={.65}/></mesh>
    <mesh position={[0,.24,.65]}><boxGeometry args={[.055,.025,1.1]}/><meshBasicMaterial color={ship.accent}/></mesh>
    <mesh position={[0,.31,-.45]}><boxGeometry args={[.64,.23,.62]}/><meshStandardMaterial color="#526a78" metalness={.6} roughness={.45}/></mesh>
    <mesh position={[0,.48,-.48]}><boxGeometry args={[.42,.12,.38]}/><meshStandardMaterial color="#b4bab6" metalness={.45} roughness={.5}/></mesh>
    <mesh position={[0,.37,-.12]} rotation={[-.15,0,0]}><boxGeometry args={[.51,.075,.025]}/><meshBasicMaterial color={ship.accent}/></mesh>
    {[-1,1].map(side=><group key={side}>
      <Engine x={side*.55} accent={ship.accent}/>
      <mesh position={[side*.44,.14,.5]}><boxGeometry args={[.055,.065,1.15]}/><meshStandardMaterial color="#536976" metalness={.6} roughness={.5}/></mesh>
      <mesh position={[side*.83,.1,-.73]} rotation={[0,side*.55,0]}><boxGeometry args={[.13,.12,.72]}/><meshStandardMaterial color="#bec2bc" metalness={.45} roughness={.5}/></mesh>
      <mesh position={[side*.46,.22,.99]}><sphereGeometry args={[.035,8,6]}/><meshBasicMaterial color={ship.accent}/></mesh>
      {quality!=='low'&&[-.95,-.64,-.33].map(z=><mesh key={z} position={[side*.32,.21,z]}><boxGeometry args={[.10,.035,.045]}/><meshBasicMaterial color="#8aa1ac"/></mesh>)}
    </group>)}
    {ship.id==='flagship'&&<>
      <mesh position={[0,.52,-.9]}><boxGeometry args={[.09,.46,.11]}/><meshStandardMaterial color="#b8b9aa" metalness={.45} roughness={.55}/></mesh>
      <mesh position={[0,.75,-.9]}><boxGeometry args={[.38,.035,.07]}/><meshStandardMaterial color="#d1c9ae" metalness={.5} roughness={.5}/></mesh>
      <mesh position={[0,.52,.15]}><sphereGeometry args={[.16,12,8,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#61889c" metalness={.45} roughness={.3}/></mesh>
      {[-1,1].map(side=><mesh key={side} position={[side*.32,.18,-1.25]}><boxGeometry args={[.16,.10,.28]}/><meshStandardMaterial color="#d2c6a8" roughness={.7}/></mesh>)}
    </>}
    {ship.id==='research'&&<>
      <PanelWing side={-1}/><PanelWing side={1}/>
      {[-1,1].map(side=><group key={side} position={[side*.7,.17,.12]}>
        <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.14,.14,.98,12]}/><meshStandardMaterial color="#c2c9c5" metalness={.3} roughness={.6}/></mesh>
        <mesh position={[0,0,.5]}><circleGeometry args={[.1,12]}/><meshBasicMaterial color="#80b7cf"/></mesh>
      </group>)}
      <mesh position={[0,.54,.2]}><sphereGeometry args={[.17,12,8]}/><meshStandardMaterial color="#7ca2b2" metalness={.55} roughness={.25}/></mesh>
    </>}
    {ship.id==='communications'&&<>
      <PanelWing side={-1} warm/><PanelWing side={1} warm/>
      <group position={[0,.49,.35]} rotation={[.25,0,-.18]}>
        <mesh position={[0,.14,0]}><cylinderGeometry args={[.025,.05,.3,8]}/><meshStandardMaterial color="#b8b8aa"/></mesh>
        <mesh position={[0,.25,0]}><sphereGeometry args={[.36,20,10,0,Math.PI*2,0,Math.PI*.38]}/><meshStandardMaterial color="#d1c6ae" side={THREE.DoubleSide} roughness={.55} metalness={.4}/></mesh>
        <mesh position={[0,.6,0]}><cylinderGeometry args={[.008,.008,.25,6]}/><meshStandardMaterial color="#bdbaa9"/></mesh>
        <mesh position={[0,.74,0]}><sphereGeometry args={[.028,8,6]}/><meshBasicMaterial color={ship.accent}/></mesh>
      </group>
      {[-1,1].map(side=><mesh key={side} position={[side*.4,.53,-.9]}><cylinderGeometry args={[.009,.016,.58,6]}/><meshStandardMaterial color="#d7cdb6"/></mesh>)}
    </>}
    <Html position={[0,.7,2.35]} center wrapperClass="fleet-label-anchor" style={{pointerEvents:'none'}} zIndexRange={[17,0]}>
      <button className={`fleet-label ${overview&&ship.id!=='flagship'?'fleet-label-quiet':''} ${hovered||(!overview&&selected)?'is-highlighted':''}`} style={{'--ship-accent':ship.accent} as React.CSSProperties} aria-label={`Open ${ship.name}`} onClick={()=>openWork(ship.id)} onPointerEnter={()=>setHovered(true)} onPointerLeave={leave}>
        <small>{ship.code}</small><strong>{ship.name}</strong><span>{ship.role} ↗</span>
      </button>
    </Html>
  </group>;
}
export default function Fleet({ overview=false }: { overview?: boolean }) {
  return <group position={overview?[5.5,2.2,3.5]:[-3.6,0,0]} scale={overview ? .52 : 1} rotation={[0,overview?-.45:0,0]}>
    <ambientLight intensity={.7}/><directionalLight position={[-6,8,10]} color="#e4eaf0" intensity={2.3}/>
    {fleetShips.map(ship=><Ship key={ship.id} ship={ship} overview={overview}/>)}
  </group>;
}
