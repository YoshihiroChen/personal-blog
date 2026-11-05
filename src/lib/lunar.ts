import { ancestors, nodeById } from '@/data/universe';

export const lunarBases = [
  { id: 'it', code: '01', name: 'Technology', subtitle: 'Systems, code & experiments', accent: '#a9c9dc', position: [-1.5, .8, 3.55] as [number, number, number] },
  { id: 'languages', code: '02', name: 'Languages', subtitle: 'Words, culture & connection', accent: '#d8bea0', position: [1.45, -.65, 3.6] as [number, number, number] },
];
export function lunarLocation(id: string) {
  const path = ancestors(id);
  const moonIndex = path.findIndex(node => node.id === 'knowledge');
  if (moonIndex < 0) return null;
  const trail = path.slice(moonIndex);
  return { trail, base: lunarBases.find(base => base.id === trail[1]?.id) ?? null, node: nodeById[id], level: trail.length - 1 };
}
export const chamberPositions = [
  { x: 11, y: 15, w: 28, h: 28 },
  { x: 61, y: 15, w: 28, h: 28 },
  { x: 11, y: 57, w: 28, h: 28 },
  { x: 61, y: 57, w: 28, h: 28 },
  { x: 39, y: 73, w: 22, h: 23 },
];
