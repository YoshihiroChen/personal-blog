import { solarBodies } from '@/data/solar-system';
import { solarOverviewDistance } from '@/lib/orbits';

export const ENTRY_PAUSE_SECONDS = 0;
export const ENTRY_FLIGHT_SECONDS = 2.2;
/** Begin closer to the system; finish with a tighter view of the inner planets. */
export function entryCameraPositions(aspect: number) {
  const wideDistance = solarOverviewDistance(aspect, solarBodies.map(body => body.orbit)) * 0.8;
  const innerOrbits = solarBodies.slice(0, solarBodies.findIndex(body => body.nodeId === 'saturn') + 1);
  const closeDistance = solarOverviewDistance(aspect, innerOrbits.map(body => body.orbit)) * 0.7;
  const elevation = 35 * Math.PI / 180;
  const position = (distance: number) => ({ x: 0, y: distance * Math.sin(elevation), z: distance * Math.cos(elevation) });
  const exploreDistance = closeDistance * 0.5;
  return { wide: position(wideDistance), close: position(closeDistance), explore: position(exploreDistance), wideDistance, closeDistance, exploreDistance };
}
