import { solarBodies } from '@/data/solar-system';

export const planetIds = ['sun', ...solarBodies.map(body => body.nodeId), 'knowledge'];
export function planetHref(id: string) { return `/planets/${encodeURIComponent(id)}/`; }
