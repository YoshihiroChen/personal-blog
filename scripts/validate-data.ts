import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { root, themes, nodes } from '../src/data/universe';
import { stories } from '../src/data/stories';
import { places, visits } from '../src/data/travels';
import { validateUniverse } from '../src/lib/validate';
const errors=validateUniverse(root,Object.keys(themes),stories,places,visits);
const publicRoot=resolve('public');
const assets=[...nodes.flatMap(n=>n.visual?.texture?[n.visual.texture]:[]),...visits.flatMap(v=>v.photos.map(p=>p.src)),'/textures/earth-day.jpg','/textures/earth-night.jpg'];
for(const asset of assets){const path=resolve(publicRoot,asset.replace(/^\//,''));if(!path.startsWith(publicRoot+sep)||!existsSync(path))errors.push(`Missing or unsafe public asset: ${asset}`);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Validated ${nodes.length} celestial nodes, ${stories.length} public stories, ${places.length} places and ${visits.length} visits.`);
