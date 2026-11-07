import { test } from 'node:test';
import { Vector3, Euler } from 'three';
import assert from 'node:assert/strict';
import { dateLabel, latLngToVector, earthFocusRotation } from './content';
import { validDate,validateUniverse } from './validate';
import { useUniverse } from '../stores/universe';
import { root,themes,ancestors,nodeById } from '../data/universe';
import { stories } from '../data/stories';
import { places,visits } from '../data/travels';
test('dates preserve unknown precision and year ranges',()=>{
  assert.equal(dateLabel({precision:'year',value:'2020'}),'2020');
  assert.equal(dateLabel({precision:'unknown'}),'Date to come');
  assert.equal(dateLabel({precision:'year',value:'2018',end:'2020'}),'2018 — 2020');
  assert.equal(validDate({precision:'day',value:'2024-02-29'}),true);
  assert.equal(validDate({precision:'day',value:'2023-02-29'}),false);
  assert.equal(validDate({precision:'year',value:'2022',end:'2018'}),false);
});
test('coordinates match SphereGeometry equirectangular UV, without mirroring',()=>{
  assert.deepEqual(latLngToVector(0,0),[1,0,-0]);
  const east=latLngToVector(0,90);assert.ok(Math.abs(east[0])<1e-12);assert.equal(east[2],-1);
  const north=latLngToVector(90,0);assert.equal(north[1],1);
  for(const place of places){const v=latLngToVector(place.latitude,place.longitude,3.3);assert.ok(Math.abs(Math.hypot(...v)-3.3)<1e-10);const lng=Math.atan2(-v[2],v[0])*180/Math.PI;assert.ok(Math.abs(lng-place.longitude)<1e-10);}
});
test('knowledge supports more than three levels, including React → Next.js',()=>{
  assert.deepEqual(ancestors('nextjs').map(n=>n.id),['universe','earth','knowledge','it','frontend','react','nextjs']);
  assert.deepEqual(validateUniverse(root,Object.keys(themes),stories,places,visits),[]);
});
test('build validation rejects invalid references, cycles, dates, and unpublished content',()=>{
  const broken=structuredClone(root);broken.children![0].parentId='missing';assert.ok(validateUniverse(broken,Object.keys(themes),stories,places,visits).some(e=>e.includes('Invalid parent')));
  const cyclic=structuredClone(root);cyclic.children!.push(cyclic);assert.ok(validateUniverse(cyclic,Object.keys(themes),stories,places,visits).some(e=>e.includes('Cycle')));
  assert.ok(validateUniverse(root,Object.keys(themes),[{...stories[0],status:'private'}],places,visits).some(e=>e.includes('Non-public')));
  assert.ok(validateUniverse(root,Object.keys(themes),stories,[{...places[0],latitude:100}],visits).some(e=>e.includes('coordinates')));
});

test('selected city rotates to the visible front of the globe',()=>{
 for(const place of places){
  const position=new Vector3(...latLngToVector(place.latitude,place.longitude));
  position.applyEuler(new Euler(...earthFocusRotation(place.latitude,place.longitude)));
  assert.ok(Math.abs(position.x)<1e-12);assert.ok(Math.abs(position.y)<1e-12);assert.ok(Math.abs(position.z-1)<1e-12);
 }
});

test('moon navigation preserves language stories and deep knowledge navigation',()=>{
  const initial=useUniverse.getState();
  try{
    initial.navigate('knowledge');
    assert.equal(nodeById[useUniverse.getState().focusedId].type,'moon');
    useUniverse.getState().explore('languages');
    useUniverse.getState().explore('japanese');
    const selected=useUniverse.getState();
    assert.equal(selected.mode,'knowledge');
    assert.deepEqual(stories.filter(story=>story.status==='public'&&story.celestialNodeIds.includes(selected.selectedId!)).map(story=>story.id),['japanese']);
    selected.explore('nextjs');
    useUniverse.getState().back();
    assert.equal(useUniverse.getState().focusedId,'react');
    useUniverse.getState().explore('knowledge');
    useUniverse.getState().back();
    assert.equal(useUniverse.getState().focusedId,'earth');
    assert.equal(useUniverse.getState().mode,'earth');
  }finally{useUniverse.setState(initial,true);}
});
