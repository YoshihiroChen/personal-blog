'use client';
import { useEffect, useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { lunarBases } from '@/lib/lunar';
import { useUniverse } from '@/stores/universe';
import { ignoreOrbitRaycast } from '@/lib/orbits';

type Base = (typeof lunarBases)[number];
function SolarArray({ x }: { x: number }) {
  return <group position={[x,.11,0]} rotation={[0,0,x>0?-.12:.12]}>
    <mesh position={[0,-.035,0]}><boxGeometry args={[.025,.09,.3]}/><meshStandardMaterial color="#8b9296" roughness={.7}/></mesh>
    <mesh><boxGeometry args={[.22,.025,.46]}/><meshStandardMaterial color="#142b43" metalness={.45} roughness={.5}/></mesh>
    {[-.14,0,.14].map(z=><mesh key={z} position={[0,.014,z]}><boxGeometry args={[.205,.004,.004]}/><meshBasicMaterial color="#698eaa"/></mesh>)}
    <mesh position={[0,.014,0]}><boxGeometry args={[.004,.004,.44]}/><meshBasicMaterial color="#698eaa"/></mesh>
    {[-.112,.112].map(x=><mesh key={x} position={[x,.008,0]}><boxGeometry args={[.008,.02,.48]}/><meshStandardMaterial color="#9eabb3" metalness={.35}/></mesh>)}
  </group>;
}
function Habitat({ z, accent }: { z: number; accent: string }) {
  return <group position={[0,.15,z]}>
    <mesh rotation={[0,0,Math.PI/2]}><capsuleGeometry args={[.09,.23,4,12]}/><meshStandardMaterial color="#d1d0c5" roughness={.82} metalness={.12}/></mesh>
    {[-.09,.09].map(x=><mesh key={x} position={[x,-.07,0]}><boxGeometry args={[.035,.12,.13]}/><meshStandardMaterial color="#7c8185" roughness={.9}/></mesh>)}
    {[-.08,0,.08].map(x=><mesh key={x} position={[x,.055,.071]}><boxGeometry args={[.045,.035,.012]}/><meshBasicMaterial color={accent}/></mesh>)}
    <mesh position={[.19,-.01,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.055,.055,.065,12]}/><meshStandardMaterial color="#8b989c" roughness={.7}/></mesh>
    <mesh position={[.228,-.01,0]} rotation={[0,Math.PI/2,0]}><circleGeometry args={[.043,12]}/><meshBasicMaterial color="#233746" side={THREE.DoubleSide}/></mesh>
  </group>;
}
export default function LunarBase({ base }: { base: Base }) {
  const explore=useUniverse(state=>state.explore);
  const [hovered,setHovered]=useState(false);
  useEffect(()=>()=>{document.body.style.cursor='auto';},[]);
  const pose=useMemo(()=>{
    const normal=new THREE.Vector3(...base.position).normalize();
    return {position:normal.clone().multiplyScalar(3.805),rotation:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),normal)};
  },[base.position]);
  const open=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();explore(base.id);};
  const enter=(event:ThreeEvent<PointerEvent>)=>{event.stopPropagation();setHovered(true);document.body.style.cursor='pointer';};
  const leave=()=>{setHovered(false);document.body.style.cursor='auto';};
  return <group position={pose.position} quaternion={pose.rotation} onClick={open} onPointerOver={enter} onPointerOut={leave}>
    {/* Terraced foundations keep the facility seated on the curved ground. */}
    <mesh position={[0,.018,0]}><cylinderGeometry args={[.34,.39,.065,32]}/><meshStandardMaterial color="#585d60" roughness={1}/></mesh>
    <mesh position={[0,.055,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.285,.302,32]}/><meshBasicMaterial color={base.accent} transparent opacity={hovered?.8:.35} side={THREE.DoubleSide}/></mesh>
    <Habitat z={-.13} accent={base.id==='it'?'#a9d5e4':'#e7c69a'}/>
    <Habitat z={.13} accent={base.id==='it'?'#a9d5e4':'#e7c69a'}/>
    <mesh position={[0,.12,0]}><boxGeometry args={[.10,.09,.2]}/><meshStandardMaterial color="#a8aaa4" roughness={.8}/></mesh>
    <SolarArray x={-.43}/><SolarArray x={.43}/>
    {/* Observation dome and communication mast. */}
    <mesh position={[-.17,.12,0]}><sphereGeometry args={[.10,16,8,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#66899e" metalness={.4} roughness={.3}/></mesh>
    <group position={[.19,.09,-.27]}>
      <mesh position={[0,.14,0]}><cylinderGeometry args={[.008,.014,.28,8]}/><meshStandardMaterial color="#c1c2b9" roughness={.7}/></mesh>
      {base.id==='languages'?<group position={[0,.28,0]} rotation={[.35,0,-.35]}>
        <mesh><sphereGeometry args={[.12,16,8,0,Math.PI*2,0,Math.PI*.35]}/><meshStandardMaterial color="#d9d9cd" roughness={.65} side={THREE.DoubleSide}/></mesh>
        <mesh position={[0,.14,0]}><cylinderGeometry args={[.004,.004,.14,6]}/><meshStandardMaterial color="#a9afb0"/></mesh>
        <mesh position={[0,.21,0]}><sphereGeometry args={[.012,8,6]}/><meshBasicMaterial color={base.accent}/></mesh>
      </group>:<group position={[0,.27,0]}>
        <mesh><boxGeometry args={[.16,.012,.012]}/><meshStandardMaterial color="#bbc5c9"/></mesh>
        <mesh position={[0,.035,0]}><sphereGeometry args={[.015,8,6]}/><meshBasicMaterial color="#e4c69b"/></mesh>
      </group>}
    </group>
    <group position={[0,.025,.46]}>
      <mesh rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.145,28]}/><meshStandardMaterial color="#747674" roughness={1}/></mesh>
      <mesh position={[0,.004,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.11,.12,28]}/><meshBasicMaterial color="#d8c7a0" side={THREE.DoubleSide}/></mesh>
      <mesh position={[0,.006,0]}><boxGeometry args={[.07,.004,.012]}/><meshBasicMaterial color="#d8c7a0"/></mesh>
      {[-.06,.06].map(x=><mesh key={x} position={[x,.006,0]}><boxGeometry args={[.012,.004,.07]}/><meshBasicMaterial color="#d8c7a0"/></mesh>)}
    </group>
    {[-.25,.25].map(x=><mesh key={x} position={[x,.09,.28]}><sphereGeometry args={[.018,8,6]}/><meshBasicMaterial color="#edc68e"/></mesh>)}
    {hovered&&<mesh position={[0,.065,0]} rotation={[-Math.PI/2,0,0]} raycast={ignoreOrbitRaycast}><ringGeometry args={[.59,.605,48]}/><meshBasicMaterial color={base.accent} transparent opacity={.75} side={THREE.DoubleSide} depthWrite={false}/></mesh>}
    <Html position={[0,.62,0]} center occlude wrapperClass="lunar-beacon-anchor" style={{pointerEvents:'none'}} zIndexRange={[18,0]}>
      <button className={`lunar-beacon facility-label ${hovered?'facility-hovered':''}`} style={{'--beacon-color':base.accent} as React.CSSProperties} onClick={()=>explore(base.id)} onPointerEnter={()=>setHovered(true)} onPointerLeave={leave} aria-label={`Enter ${base.name} base`}>
        <span className="lunar-beacon-card"><small>BASE / {base.code}</small><strong>{base.name}</strong><em>{base.subtitle}</em><span>Enter base ↗</span></span>
      </button>
    </Html>
  </group>;
}
