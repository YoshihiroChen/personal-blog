import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Vector3, BufferGeometry, LineLoop, LineBasicMaterial, Raycaster } from 'three';
import { solarBodies, moonOrbit } from '../data/solar-system';
import { nodeById } from '../data/universe';
import { eccentricAnomaly, orbitalPosition, positionOnEllipse, solarOverviewDistance, ignoreOrbitRaycast } from './orbits';
const distance=(position:[number,number,number])=>Math.hypot(...position);
test('eight planets orbit the Sun in solar-system order, with the Moon attached to Earth',()=>{
  assert.deepEqual(solarBodies.filter(b=>nodeById[b.nodeId].type==='planet').map(b=>b.nodeId),['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune']);
  assert.ok(solarBodies.every(b=>b.parentId==='sun'));
  assert.equal(nodeById.sun.type,'star');
  assert.equal(nodeById.knowledge.parentId,'earth');
  assert.equal(nodeById.knowledge.type,'moon');
  assert.equal(nodeById.knowledge.themeId,'moon');
  assert.equal(nodeById.knowledge.visual?.rings,undefined);
  assert.equal(nodeById.pluto.type,'celestial-body');
  for(let i=1;i<solarBodies.length;i++){
    assert.ok(solarBodies[i].orbit.semiMajorAxis>solarBodies[i-1].orbit.semiMajorAxis);
    assert.ok(solarBodies[i].orbit.periodDays>solarBodies[i-1].orbit.periodDays);
  }
});
test('orbit paths and moving bodies use the same focus-centred ellipse',()=>{
  for(const orbit of [...solarBodies.map(b=>b.orbit),moonOrbit]){
    assert.ok(Math.abs(distance(positionOnEllipse(orbit,0))-orbit.semiMajorAxis*(1-orbit.eccentricity))<1e-9);
    assert.ok(Math.abs(distance(positionOnEllipse(orbit,Math.PI))-orbit.semiMajorAxis*(1+orbit.eccentricity))<1e-9);
    const periodEnd=orbitalPosition(orbit,orbit.periodDays),start=orbitalPosition(orbit,0);
    assert.ok(new Vector3(...periodEnd).distanceTo(new Vector3(...start))<1e-8);
  }
});
test('Kepler solver preserves varying orbital speed and physical period relationships',()=>{
  for(const e of [0,.0167,.2056,.2488])for(const mean of [-4,-1,0,1,4]){
    const E=eccentricAnomaly(mean,e);
    assert.ok(Math.abs(Math.sin(E-e*Math.sin(E))-Math.sin(mean))<1e-9);
  }
  const mercury=solarBodies[0].orbit;
  const atPerihelion={...mercury,meanAnomaly:0},atAphelion={...mercury,meanAnomaly:180};
  const speed=(orbit:typeof mercury)=>new Vector3(...orbitalPosition(orbit,.01)).distanceTo(new Vector3(...orbitalPosition(orbit,0)))/.01;
  assert.ok(speed(atPerihelion)>speed(atAphelion));
  for(const body of solarBodies){assert.ok(Math.abs(body.orbit.periodDays/365.256-body.semiMajorAxisAU**1.5)/(body.orbit.periodDays/365.256)<.005);}
});

test('overview camera fits all projected orbit paths on desktop and portrait screens',()=>{
  for(const aspect of [1440/1000,390/844]){
    const distance=solarOverviewDistance(aspect,solarBodies.map(b=>b.orbit)),angle=35*Math.PI/180,tan=Math.tan(21*Math.PI/180);
    for(const body of solarBodies)for(let i=0;i<128;i++){
      const [x,y,z]=positionOnEllipse(body.orbit,i/128*Math.PI*2);
      const depth=distance-y*Math.sin(angle)-z*Math.cos(angle);
      assert.ok(depth>0);
      assert.ok(Math.abs(x/depth)<tan*aspect);
      assert.ok(Math.abs((y*Math.cos(angle)-z*Math.sin(angle))/depth)<tan);
    }
  }
});

test('decorative lunar orbit cannot occlude a selected city label',()=>{
  const geometry=new BufferGeometry().setFromPoints(Array.from({length:129},(_,i)=>new Vector3(Math.cos(i/128*Math.PI*2)*4.7,0,Math.sin(i/128*Math.PI*2)*4.7)));
  const material=new LineBasicMaterial(),line=new LineLoop(geometry,material);
  const raycaster=new Raycaster(new Vector3(0,0,10),new Vector3(0,0,-1));
  assert.ok(raycaster.intersectObject(line).length>0);
  line.raycast=ignoreOrbitRaycast;
  assert.equal(raycaster.intersectObject(line).length,0);
  geometry.dispose();material.dispose();
});
