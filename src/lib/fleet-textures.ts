import * as THREE from 'three';
import type { FleetHullKind } from '@/data/works';

interface FleetTextures { map: THREE.CanvasTexture; packed: THREE.CanvasTexture; solar: THREE.CanvasTexture }
const cache=new Map<string,FleetTextures>();
function canvas(size: number, height=size) {
  const element=document.createElement('canvas');element.width=size;element.height=height;
  const context=element.getContext('2d');
  if(!context)throw new Error('A 2D canvas is required for vessel surface textures.');
  return {element,context};
}
function texture(element: HTMLCanvasElement, color=false) {
  const result=new THREE.CanvasTexture(element);
  if(color)result.colorSpace=THREE.SRGBColorSpace;
  result.anisotropy=4;
  return result;
}
/** Shared paint + packed relief/roughness/metalness maps; generated once per ship/resolution. */
export function fleetTextures(kind: FleetHullKind, lowDetail: boolean): FleetTextures {
  const size=lowDetail?256:512,key=`${kind}:${size}`;
  const existing=cache.get(key);if(existing)return existing;
  const paint=canvas(size),relief=canvas(size),solar=canvas(size,size/2);
  const ctx=paint.context,packed=relief.context;
  let seed=kind==='flagship'?1421:kind==='research'?5377:8091;
  const rand=()=>{seed=Math.imul(seed,1664525)+1013904223|0;return(seed>>>0)/4294967296;};
  const warm=kind==='communications',accent=kind==='flagship'?'#b9a27a':warm?'#b08b62':'#759eb1';
  ctx.fillStyle='#8a9399';ctx.fillRect(0,0,size,size);
  packed.fillStyle='rgb(128,190,175)';packed.fillRect(0,0,size,size);
  const gap=Math.max(1,size/256),cols=6,rows=10;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++) {
    const x=col*size/cols,y=row*size/rows,w=size/cols,h=size/rows;
    const shade=155+Math.floor(rand()*40),rough=155+Math.floor(rand()*65);
    ctx.fillStyle=`rgb(${shade+(warm?7:0)},${shade+3},${shade+(warm?-8:8)})`;ctx.fillRect(x+gap,y+gap,w-gap*2,h-gap*2);
    ctx.strokeStyle='#e0e3dd66';ctx.lineWidth=gap*.65;ctx.beginPath();ctx.moveTo(x+gap*2,y+h-gap*2);ctx.lineTo(x+gap*2,y+gap*2);ctx.lineTo(x+w-gap*2,y+gap*2);ctx.stroke();
    packed.fillStyle=`rgb(134,${rough},${165+Math.floor(rand()*40)})`;packed.fillRect(x+gap,y+gap,w-gap*2,h-gap*2);
    for(const [bx,by] of [[x+gap*4,y+gap*4],[x+w-gap*4,y+gap*4],[x+gap*4,y+h-gap*4],[x+w-gap*4,y+h-gap*4]]) {
      ctx.fillStyle='#626d75';ctx.fillRect(bx,by,gap*1.2,gap*1.2);packed.fillStyle=`rgb(151,${rough},180)`;packed.fillRect(bx,by,gap*1.2,gap*1.2);
    }
    if((row+col)%4===0){ctx.fillStyle=accent;ctx.fillRect(x+w*.16,y+h*.74,w*.42,gap*1.5);}
  }
  // Recessed maintenance covers and cooling slots interrupt the regular armour grid.
  for(const [u,v,w,h] of [[.13,.24,.16,.10],[.69,.55,.17,.13],[.37,.71,.25,.09],[.39,.13,.22,.065]]) {
    const x=u*size,y=v*size,sw=w*size,sh=h*size;
    ctx.fillStyle='#3d4b55';ctx.fillRect(x,y,sw,sh);ctx.strokeStyle='#d2dad180';ctx.lineWidth=gap;ctx.strokeRect(x+gap,y+gap,sw-gap*2,sh-gap*2);
    packed.fillStyle='rgb(103,215,145)';packed.fillRect(x,y,sw,sh);
    for(let i=0;i<5;i++){ctx.fillStyle='#192b38';ctx.fillRect(x+sw*.14,y+sh*(.16+i*.13),sw*.7,gap);packed.fillStyle='rgb(80,205,145)';packed.fillRect(x+sw*.14,y+sh*(.16+i*.13),sw*.7,gap);}
  }
  // Small wear marks and grain change both reflectivity and paint without adding meshes.
  for(let i=0;i<180;i++){
    const x=rand()*size,y=rand()*size;
    ctx.strokeStyle=rand()>.5?'#e2dfce38':'#273b4940';ctx.lineWidth=gap*.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(rand()-.5)*size*.035,y+rand()*size*.014);ctx.stroke();
  }
  ctx.fillStyle=accent;ctx.fillRect(size*.46,size*.32,size*.08,size*.18);
  ctx.save();ctx.translate(size*.42,size*.86);ctx.rotate(-Math.PI/2);ctx.fillStyle='#22343ddb';ctx.font=`600 ${size*.037}px monospace`;ctx.fillText(kind==='flagship'?'JC—001':kind==='research'?'JC—002':'JC—003',0,0);ctx.restore();
  const image=ctx.getImageData(0,0,size,size),surface=packed.getImageData(0,0,size,size);
  for(let i=0;i<image.data.length;i+=4){
    const n=(rand()-.5)*7;
    for(let c=0;c<3;c++)image.data[i+c]=Math.max(0,Math.min(255,image.data[i+c]+n));
    surface.data[i]=Math.max(0,Math.min(255,surface.data[i]+n*.45));surface.data[i+1]=Math.max(0,Math.min(255,surface.data[i+1]+n));
  }
  ctx.putImageData(image,0,0);packed.putImageData(surface,0,0);
  const cell=solar.context;
  cell.fillStyle=warm?'#46372c':'#112a42';cell.fillRect(0,0,size,size/2);
  for(let y=0;y<4;y++)for(let x=0;x<8;x++){
    const px=x*size/8,py=y*size/8;
    cell.fillStyle=warm?`rgb(${58+x*2},${47+y*3},37)`:`rgb(${21+y*3},${47+x*2},${68+y*5})`;
    cell.fillRect(px+gap,py+gap,size/8-gap*2,size/8-gap*2);
    cell.fillStyle=warm?'#b495704d':'#9abbd366';cell.fillRect(px+size/16,py+gap,gap*.5,size/8-gap*2);
  }
  const result={map:texture(paint.element,true),packed:texture(relief.element),solar:texture(solar.element,true)};
  cache.set(key,result);return result;
}
