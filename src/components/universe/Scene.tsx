'use client';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, events, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Billboard, Html, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import { planetHref } from '@/lib/planets';
import { lunarBases, lunarLocation } from '@/lib/lunar';
import { canvasPointer } from '@/lib/pointer';
import { useUniverse } from '@/stores/universe';
import { nodeById, themes } from '@/data/universe';
import { solarBodies, moonOrbit, SOLAR_DAYS_PER_SECOND, type OrbitElements } from '@/data/solar-system';
import { orbitalPosition, positionOnEllipse, ignoreOrbitRaycast } from '@/lib/orbits';
import { places, visits } from '@/data/travels';
import { latLngToVector, visibleInYear, earthFocusRotation } from '@/lib/content';
import type { CelestialNode } from '@/types/universe';
import { entryCameraPositions, ENTRY_PAUSE_SECONDS, ENTRY_FLIGHT_SECONDS } from '@/lib/entry';
import { vertexShader, fragmentShader, atmosphereFragment } from '@/shaders/planet';

function Starfield() {
  const quality = useUniverse(s => s.quality);
  const geometry = useMemo(() => {
    const count = quality === 'low' ? 1200 : quality === 'high' ? 6500 : 3400;
    const p = new Float32Array(count * 3), c = new Float32Array(count * 3);
    let seed = 913;
    const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i=0;i<count;i++) {
      const theta=rand()*Math.PI*2, phi=Math.acos(2*rand()-1), r=160+rand()*300;
      p.set([r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta)],i*3);
      const bright=.22+Math.pow(rand(),4)*.78;
      c.set([bright*(.8+rand()*.2),bright*(.85+rand()*.15),bright],i*3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3)); return g;
  },[quality]);
  useEffect(() => () => geometry.dispose(),[geometry]);
  return <points geometry={geometry}><pointsMaterial size={.075} vertexColors sizeAttenuation transparent opacity={.95} depthWrite={false} /></points>;
}
function CameraRig({ controls }: { controls: React.RefObject<OrbitControlsImpl | null> }) {
  const camera = useThree(s => s.camera);
  const aspect = useThree(s => s.size.width / s.size.height);
  const focusedId = useUniverse(s => s.focusedId);
  const mode = useUniverse(s => s.mode);
  const reducedMotion = useUniverse(s => s.reducedMotion);
  const introComplete = useUniverse(s => s.introComplete);
  const solarExploring = useUniverse(s => s.solarExploring);
  const patch = useUniverse(s => s.patch);
  const flight = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    if (!controls.current) return;
    const control = controls.current;
    const overview = focusedId === 'universe';
    const intro = overview && mode === 'overview' && !introComplete;
    const views = entryCameraPositions(aspect);
    const lunar = lunarLocation(focusedId);
    const destination = overview ? (solarExploring ? views.explore : views.close) : lunar ? {x:0,y:.65,z:Math.max(11.8,8.2/aspect)} : focusedId === 'earth' ? { x: -2.5, y: 1, z: 10.5 } : focusedId === 'sun' ? { x: 0, y: .6, z: Math.max(12,14/aspect) } : { x: 0, y: 2, z: 16 };
    const target = focusedId === 'earth' ? { x: -1.5, y: 0, z: 0 } : { x: 0, y: 0, z: 0 };
    let disposed = false;
    const enable = () => { control.enabled = true; if (!disposed) patch({ flying: false }); };
    const finish = () => {
      enable();
      if (intro && !disposed) patch({ introComplete: true, interfaceVisible: true });
    };
    const settle = () => {
      camera.position.set(destination.x, destination.y, destination.z);
      control.target.set(target.x, target.y, target.z);
      control.update();
      finish();
    };
    const alreadyThere = camera.position.distanceToSquared(new THREE.Vector3(destination.x, destination.y, destination.z)) < 1e-6
      && control.target.distanceToSquared(new THREE.Vector3(target.x, target.y, target.z)) < 1e-6;
    if (reducedMotion || (lunar && lunar.level > 0) || (!intro && alreadyThere)) {
      settle();
      return;
    }
    if (intro) {
      camera.position.set(views.wide.x, views.wide.y, views.wide.z);
      control.target.set(0, 0, 0);
      control.update();
    }
    patch({ flying: true });
    control.enabled = false;
    const start = intro ? ENTRY_PAUSE_SECONDS : 0;
    const duration = intro ? ENTRY_FLIGHT_SECONDS : 1.6;
    flight.current = gsap.timeline({ onComplete: finish, onInterrupt: enable })
      .to(camera.position, { ...destination, duration, ease: 'power2.inOut' }, start)
      .to(control.target, { ...target, duration, ease: 'power2.inOut', onUpdate: () => control.update() }, start);
    const cancel = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      flight.current?.kill();
      if (intro) settle();
    };
    window.addEventListener('keydown', cancel);
    return () => {
      disposed = true;
      window.removeEventListener('keydown', cancel);
      flight.current?.kill();
      control.enabled = true;
    };
  }, [focusedId, mode, introComplete, solarExploring, reducedMotion, camera, controls, patch, aspect]);
  return null;
}
function EarthTextures({ onTextures }: { onTextures: (day: THREE.Texture, night: THREE.Texture) => void }) {
  const [day,night]=useTexture(['/textures/earth-day.jpg','/textures/earth-night.jpg']);
  useEffect(()=>{day.colorSpace=THREE.SRGBColorSpace;night.colorSpace=THREE.SRGBColorSpace;onTextures(day,night);},[day,night,onTextures]);
  return null;
}
function Planet({ node, position, radius, label=true, central=false, solar=false, quiet=false }: { node: CelestialNode; position: [number,number,number]; radius: number; label?: boolean; central?: boolean; solar?: boolean; quiet?: boolean }) {
  const openPlanet=()=>{if(solar)window.location.assign(planetHref(node.id));else if(node.parentId==='emotions'){explore('emotions');useUniverse.getState().patch({selectedId:node.id});}else explore(node.id);};
  const group=useRef<THREE.Group>(null), surface=useRef<THREE.Mesh>(null), shader=useRef<THREE.ShaderMaterial>(null);
  const [hovered,setHovered]=useState(false);
  const [textures,setTextures]=useState<{day:THREE.Texture;night:THREE.Texture}|null>(null);
  const textureCallback=useMemo(()=>(day:THREE.Texture,night:THREE.Texture)=>setTextures({day,night}),[]);
  const theme=themes[node.themeId];
  const explore=useUniverse(s=>s.explore), year=useUniverse(s=>s.year), quality=useUniverse(s=>s.quality), reduced=useUniverse(s=>s.reducedMotion), placeId=useUniverse(s=>s.selectedPlaceId);
  const earthMode=useUniverse(s=>s.focusedId==='earth');
  const onMoonSurface=useUniverse(s=>s.focusedId==='knowledge');
  const isFuture=!solar&&(node.since??0)>year;
  const uniforms=useMemo(()=>({uDetail:{value:quality==='high'?5:quality==='low'?2:3},uSunView:{value:new THREE.Vector3()},uSolarLight:{value:solar?1:0},uTime:{value:0},uOpacity:{value:isFuture?.28:1},uKind:{value:node.themeId==='earth' && !textures?1:theme.kind},uColor:{value:new THREE.Color(theme.color)},uGlow:{value:new THREE.Color(theme.light)},uDay:{value:textures?.day??null},uNight:{value:textures?.night??null}}),[theme,node.themeId,textures,isFuture,solar,quality]);
  useFrame((state,delta)=>{
    if(solar)uniforms.uSunView.value.set(0,0,0).applyMatrix4(state.camera.matrixWorldInverse);
    if(shader.current&&!reduced)shader.current.uniforms.uTime.value=state.clock.elapsedTime;
    if(!surface.current)return;
    if(node.themeId==='earth') {
      const selected=places.find(p=>p.id===placeId);
      const target=new THREE.Quaternion().setFromEuler(new THREE.Euler(...(selected?earthFocusRotation(selected.latitude,selected.longitude):[.12,-Math.PI*1.25,0] as [number,number,number])));
      if(earthMode)surface.current.quaternion.slerp(target,reduced?1:Math.min(1,delta*2));
      else if(!reduced)surface.current.rotation.y+=delta*.025;
    } else if(!reduced&&!(node.themeId==='moon'&&onMoonSurface))surface.current.rotation.y+=delta*(node.visual?.rotationSpeed??.028);
    if(group.current){const scale=hovered&&!central?1.06:1;group.current.scale.lerp(new THREE.Vector3(scale,scale,scale),reduced?1:Math.min(1,delta*8));}
  }, -1);
  const click=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();if(!central)openPlanet();};
  const segments=quality==='low'?32:quality==='high'?96:64;
  const enter=(event:ThreeEvent<PointerEvent>)=>{if(central)return;event.stopPropagation();setHovered(true);document.body.style.cursor='pointer';};
  const leave=()=>{setHovered(false);document.body.style.cursor='auto';};
  return <group position={position} ref={group} onClick={click} onPointerOver={enter} onPointerOut={leave}>
    {solar&&<mesh><sphereGeometry args={[Math.max(radius*1.12,.45),20,16]}/><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false}/></mesh>}
    {hovered&&!central&&<Billboard><mesh raycast={ignoreOrbitRaycast}><ringGeometry args={[radius*1.17,radius*1.2,64]}/><meshBasicMaterial color={theme.light} transparent opacity={.75} side={THREE.DoubleSide} depthWrite={false}/></mesh></Billboard>}
    <mesh ref={surface}>
      <sphereGeometry args={[radius,segments,segments]} />
      <shaderMaterial ref={shader} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent={isFuture} opacity={isFuture?.35:1} />
      {node.themeId==='earth'&&earthMode&&places.filter(p=>visits.some(v=>v.placeId===p.id&&v.status==='public'&&visibleInYear(v.visitedAt,year))).map(place=><group key={place.id} position={latLngToVector(place.latitude,place.longitude,radius*1.016)}>
        <mesh onClick={e=>{e.stopPropagation();useUniverse.getState().patch({selectedPlaceId:place.id,selectedId:'earth',activeStoryId:null});}}><sphereGeometry args={[radius*.016,12,12]}/><meshBasicMaterial color={placeId===place.id?'#ffdda9':'#b8e8ff'}/></mesh>
        <Html position={latLngToVector(place.latitude,place.longitude,radius*.035)} occlude center distanceFactor={12} style={{pointerEvents:'auto',transform:'translateY(-20px)'}}><button className="city-label" onClick={e=>{e.stopPropagation();useUniverse.getState().patch({selectedPlaceId:place.id});}}>{place.english}</button></Html>
      </group>)}
    </mesh>
    {node.themeId==='earth'&&<Suspense fallback={null}><EarthTextures onTextures={textureCallback}/></Suspense>}
    {quality!=='low'&&node.visual?.atmosphere!==false&&<mesh><sphereGeometry args={[radius*1.035,48,48]}/><shaderMaterial vertexShader={vertexShader} fragmentShader={atmosphereFragment} uniforms={uniforms} transparent blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>}
    {node.visual?.rings&&<group rotation={[1.13,.24,-.3]}>
      {[{inner:1.35,outer:1.7,opacity:.32},{inner:1.73,outer:1.94,opacity:.55},{inner:1.97,outer:2.25,opacity:.25}].map((r,i)=><mesh key={i}><ringGeometry args={[radius*r.inner,radius*r.outer,quality==='low'?80:160]}/><shaderMaterial side={THREE.DoubleSide} transparent depthWrite={false} uniforms={{uRingColor:{value:new THREE.Color(theme.light)},uRadius:{value:radius},uAlpha:{value:r.opacity}}} vertexShader={`varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`varying vec3 vLocal;uniform vec3 uRingColor;uniform float uRadius;uniform float uAlpha;void main(){float r=length(vLocal.xy)/uRadius;float bands=.5+.25*sin(r*215.)+.15*sin(r*463.);float shadow=.35+.65*smoothstep(-.8,.3,normalize(vLocal).x);gl_FragColor=vec4(uRingColor*(.4+bands*.55)*shadow,uAlpha*(.35+bands*.65));}`}/></mesh>)}
    </group>}
    {label&&<Html position={[0,-radius*(node.visual?.rings?1.8:1.35)-.35,0]} center distanceFactor={solar?undefined:23} wrapperClass="planet-label-anchor" style={{pointerEvents:'none'}} zIndexRange={[15,0]}>{solar?<a href={planetHref(node.id)} className={`planet-label ${quiet?'quiet':''} ${hovered?'hovered':''}`} aria-label={`Explore ${node.name}`} onPointerEnter={()=>{setHovered(true);document.body.style.cursor='pointer';}} onPointerLeave={leave} onFocus={()=>setHovered(true)} onBlur={leave}><span>{node.name}</span><small>{theme.label}</small><em>{node.description}<strong>Step inside →</strong></em></a>:<button className={`planet-label ${quiet?'quiet':''} ${hovered?'hovered':''} ${isFuture?'future':''}`} onClick={()=>explore(node.id)}><span>{node.name}</span><small>{isFuture?'Up ahead':theme.label}</small>{hovered&&<em>{node.description}</em>}</button>}</Html>}
  </group>;
}
function Orbit({ radius }: { radius: number }) {
  const geometry=useMemo(()=>new THREE.BufferGeometry().setFromPoints(Array.from({length:161},(_,i)=>new THREE.Vector3(Math.cos(i/160*Math.PI*2)*radius,0,Math.sin(i/160*Math.PI*2)*radius))),[radius]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <group rotation={[.1,0,-.15]}><lineLoop geometry={geometry} raycast={ignoreOrbitRaycast}><lineBasicMaterial color="#788a9c" transparent opacity={.1}/></lineLoop></group>;
}
function KeplerOrbit({ orbit, faint=false }: { orbit: OrbitElements; faint?: boolean }) {
  const geometry=useMemo(()=>new THREE.BufferGeometry().setFromPoints(Array.from({length:257},(_,i)=>new THREE.Vector3(...positionOnEllipse(orbit,i/256*Math.PI*2)))),[orbit]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <lineLoop geometry={geometry} raycast={ignoreOrbitRaycast}><lineBasicMaterial color={faint?'#8e8399':'#8d9caa'} transparent opacity={faint?.12:.22} depthWrite={false}/></lineLoop>;
}
function MovingBody({ orbit, days, children }: { orbit: OrbitElements; days: React.RefObject<number>; children: React.ReactNode }) {
  const ref=useRef<THREE.Group>(null);
  useFrame(()=>{ref.current?.position.set(...orbitalPosition(orbit,days.current));},-2);
  return <group ref={ref} position={orbitalPosition(orbit,days.current)}>{children}</group>;
}
function SolarSystem() {
  const days=useRef(0);
  const reduced=useUniverse(s=>s.reducedMotion);
  useFrame((_,delta)=>{if(!reduced)days.current+=Math.min(delta,.1)*SOLAR_DAYS_PER_SECOND;},-3);
  return <group>
    <Billboard><mesh renderOrder={-1}><planeGeometry args={[15,15]}/><shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`varying vec2 vUv;void main(){float r=length(vUv-.5)*2.;float glow=exp(-r*8.)*.55*(1.-smoothstep(.6,1.,r));gl_FragColor=vec4(1.,.55,.15,glow);}`}/></mesh></Billboard>
    <Planet node={nodeById.sun} position={[0,0,0]} radius={1.8} solar quiet/>
    {solarBodies.map(body=><group key={body.nodeId}>
      <KeplerOrbit orbit={body.orbit} faint={body.nodeId==='pluto'}/>
      <MovingBody orbit={body.orbit} days={days}>
        <Planet node={nodeById[body.nodeId]} position={[0,0,0]} radius={body.radius} solar quiet/>
        {body.nodeId==='earth'&&<>
          <KeplerOrbit orbit={moonOrbit} faint/>
          <MovingBody orbit={moonOrbit} days={days}><Planet node={nodeById.knowledge} position={[0,0,0]} radius={.2} solar quiet/></MovingBody>
        </>}
      </MovingBody>
    </group>)}
  </group>;
}
function EarthSystem() {
  const days=useRef(0),reduced=useUniverse(s=>s.reducedMotion);
  const localMoonOrbit=useMemo(()=>({...moonOrbit,semiMajorAxis:4.7}),[]);
  useFrame((_,delta)=>{if(!reduced)days.current+=Math.min(delta,.1)*SOLAR_DAYS_PER_SECOND;},-3);
  return <group position={[-1.8,0,0]}>
    <Planet node={nodeById.earth} position={[0,0,0]} radius={3.3} central label={false}/>
    <KeplerOrbit orbit={localMoonOrbit} faint/>
    <MovingBody orbit={localMoonOrbit} days={days}><Planet node={nodeById.knowledge} position={[0,0,0]} radius={.45}/></MovingBody>
  </group>;
}
function LunarSurface() {
  const explore=useUniverse(s=>s.explore);
  return <group>
    <Planet node={nodeById.knowledge} position={[0,0,0]} radius={3.8} central label={false}/>
    {lunarBases.map(base=><group key={base.id} position={base.position}>
      <Html center occlude wrapperClass="lunar-beacon-anchor" style={{pointerEvents:'none'}} zIndexRange={[18,0]}>
        <button className="lunar-beacon" style={{'--beacon-color':base.accent} as React.CSSProperties} onClick={()=>explore(base.id)} aria-label={`Enter ${base.name} base`}>
          <span className="lunar-beacon-pin" aria-hidden="true"><span/></span>
          <span className="lunar-beacon-card"><small>BASE / {base.code}</small><strong>{base.name}</strong><em>{base.subtitle}</em><span>Enter base ↗</span></span>
        </button>
      </Html>
    </group>)}
  </group>;
}
function CelestialSystem() {
  const focus=useUniverse(s=>s.focusedId), year=useUniverse(s=>s.year);
  const node=nodeById[focus]??nodeById.universe;
  if(focus==='universe')return <SolarSystem/>;
  if(focus==='earth')return <EarthSystem/>;
  const lunar=lunarLocation(focus);
  if(lunar)return lunar.level===0?<LunarSurface/>:null;
  if(focus==='sun')return <group position={[-3.7,0,0]}>
    <Billboard><mesh raycast={ignoreOrbitRaycast}><planeGeometry args={[7,7]}/><shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`varying vec2 vUv;void main(){float r=length(vUv-.5)*2.;float glow=exp(-r*7.)*.5*(1.-smoothstep(.6,1.,r));gl_FragColor=vec4(1.,.55,.15,glow);}`}/></mesh></Billboard>
    <Planet node={nodeById.sun} position={[0,0,0]} radius={1.25} central label={false}/>
  </group>;
  const isRegion=node.type==='region';
  const children=node.children??[];
  return <group key={focus}>
    {!isRegion&&<Planet node={node} position={[-1.5,0,0]} radius={children.length?2.1:3} central label={false}/>}
    {children.length>0&&<Orbit radius={isRegion?7:5.8}/>}
    {children.map((child,i)=>{
      const angle=i/children.length*Math.PI*2+.4;
      const r=isRegion?7:5.8;
      return <Planet key={child.id} node={child} position={[Math.cos(angle)*r-1.5,Math.sin(angle)*r*.56,Math.sin(angle)*1.2-1]} radius={isRegion?(child.visual?.radius??1):Math.min(child.visual?.radius??.85,1.15)}/>;
    })}
    {node.since&&node.since>year&&<Html position={[-1.5,-3.5,0]} center><span className="future-note">Still to come · {node.since}</span></Html>}
  </group>;
}
export default function UniverseScene({ onError }: { onError: () => void }) {
  const quality=useUniverse(s=>s.quality), reduced=useUniverse(s=>s.reducedMotion);
  const controls=useRef<OrbitControlsImpl>(null);
  const lunar=useUniverse(s=>lunarLocation(s.focusedId)?.level??-1);
  useEffect(()=>()=>{document.body.style.cursor='auto';},[]);
  // Canvas always mounts its HTML fallback, even when WebGL works. Keep it passive;
  // renderer errors reach SceneBoundary and context loss uses the listener below.
  return <Canvas events={state=>({...events(state),compute:(event,state)=>{
    const point=canvasPointer(event.clientX,event.clientY,state.gl.domElement.getBoundingClientRect());
    state.pointer.set(point.x,point.y);state.raycaster.setFromCamera(state.pointer,state.camera);
  }})} frameloop={reduced||lunar>0?'demand':'always'} camera={{position:[0,45,64],fov:42,near:.1,far:900}} dpr={[1,quality==='high'?2:quality==='low'?1:1.5]} gl={{antialias:quality!=='low',alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',onError,{once:true});}} fallback={<span>Canvas is unavailable in this browser. Use the navigation to explore.</span>}>
    <Starfield/>
    <Suspense fallback={null}><CelestialSystem/></Suspense>
    <OrbitControls ref={controls} enablePan={false} enableDamping dampingFactor={.065} minDistance={6} maxDistance={350} maxPolarAngle={Math.PI*.85} minPolarAngle={Math.PI*.12} rotateSpeed={.4} zoomSpeed={.6}/>
    <CameraRig controls={controls}/>
  </Canvas>;
}
