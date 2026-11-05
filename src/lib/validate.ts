import type { CelestialNode, Story, StoryDate, TravelPlace, TravelVisit } from '@/types/universe';
export function validDate(date: StoryDate): boolean {
  if(date.precision==='unknown')return true;
  const patterns={year:/^\d{4}$/,month:/^\d{4}-(0[1-9]|1[0-2])$/,day:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/};
  const valid=(value:string)=>{
    if(!patterns[date.precision].test(value))return false;
    if(date.precision!=='day')return true;
    const [year,month,day]=value.split('-').map(Number);
    return day<=new Date(Date.UTC(year,month,0)).getUTCDate();
  };
  return valid(date.value)&&(!date.end||(valid(date.end)&&date.end>=date.value));
}
export function validateUniverse(root:CelestialNode,themeIds:string[],stories:Story[],places:TravelPlace[],visits:TravelVisit[]):string[]{
  const errors:string[]=[],ids=new Set<string>(),objects=new Set<CelestialNode>(),all:CelestialNode[]=[];
  function walk(n:CelestialNode,parent?:string){
    if(objects.has(n)){errors.push(`Cycle or reused node: ${n.id}`);return;}objects.add(n);
    if(ids.has(n.id))errors.push(`Duplicate node ID: ${n.id}`);ids.add(n.id);all.push(n);
    if(!/^[a-z0-9-]+$/.test(n.id))errors.push(`Unsafe node ID: ${n.id}`);
    if(n.parentId!==parent)errors.push(`Invalid parent: ${n.id}`);
    if(!themeIds.includes(n.themeId))errors.push(`Missing theme: ${n.id}`);
    if(n.visual?.radius!==undefined&&(!Number.isFinite(n.visual.radius)||n.visual.radius<=0))errors.push(`Invalid radius: ${n.id}`);
    if(n.orbit&&(!Number.isFinite(n.orbit.radius)||n.orbit.radius<=0||!Number.isFinite(n.orbit.speed)))errors.push(`Invalid orbit: ${n.id}`);
    n.children?.forEach(child=>walk(child,n.id));
  }
  walk(root);
  const storyIds=new Set<string>(),placeIds=new Set<string>(),visitIds=new Set<string>();
  stories.forEach(s=>{
    if(storyIds.has(s.id))errors.push(`Duplicate story ID: ${s.id}`);storyIds.add(s.id);
    if(!/^[a-z0-9-]+$/.test(s.id))errors.push(`Unsafe story ID: ${s.id}`);
    if(s.status!=='public')errors.push(`Non-public story must be removed from published source: ${s.id}`);
    if(!validDate(s.date))errors.push(`Invalid story date: ${s.id}`);
    s.celestialNodeIds.forEach(id=>{if(!ids.has(id))errors.push(`Unknown story node: ${s.id}/${id}`);});
  });
  all.forEach(n=>n.storyIds?.forEach(id=>{if(!storyIds.has(id))errors.push(`Unknown story: ${n.id}/${id}`);}));
  places.forEach(p=>{
    if(placeIds.has(p.id))errors.push(`Duplicate place ID: ${p.id}`);placeIds.add(p.id);
    if(!Number.isFinite(p.latitude)||Math.abs(p.latitude)>90||!Number.isFinite(p.longitude)||Math.abs(p.longitude)>180)errors.push(`Invalid coordinates: ${p.id}`);
  });
  visits.forEach(v=>{
    if(visitIds.has(v.id))errors.push(`Duplicate visit ID: ${v.id}`);visitIds.add(v.id);
    if(v.status!=='public')errors.push(`Non-public visit must be removed from published source: ${v.id}`);
    if(!placeIds.has(v.placeId))errors.push(`Unknown visit place: ${v.id}`);
    if(!validDate(v.visitedAt))errors.push(`Invalid visit date: ${v.id}`);
    v.storyIds.forEach(id=>{if(!storyIds.has(id))errors.push(`Unknown visit story: ${v.id}/${id}`);});
  });return errors;
}
