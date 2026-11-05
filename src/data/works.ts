export type FleetShipId = 'flagship' | 'research' | 'communications';
export interface FleetShip {
  id: FleetShipId;
  name: string;
  role: string;
  accent: string;
  code: string;
  position: [number, number, number];
  scale: number;
}
export const fleetShips: FleetShip[] = [
  { id:'flagship',name:'My Works',role:'Flagship · Portfolio',accent:'#d9c39b',code:'JC / 001',position:[0,.35,0],scale:1 },
  { id:'research',name:'Research Vessel',role:'IT Project 01',accent:'#96c8dc',code:'JC / 002',position:[-2.7,-.4,2.4],scale:.64 },
  { id:'communications',name:'Communications Vessel',role:'Language Project 01',accent:'#dfb58c',code:'JC / 003',position:[2,.15,1.6],scale:.68 },
];
export const fleetShipById = Object.fromEntries(fleetShips.map(ship=>[ship.id,ship])) as Record<FleetShipId,FleetShip>;
export function isFleetShipId(id: string): id is FleetShipId { return fleetShips.some(ship=>ship.id===id); }
export const workProjects = {
  research: {
    title:'IT Project 01',category:'IT PROJECT',intro:'A place for one of my software projects, from the idea behind it to the details of how it was built.',
    sections:[{title:'The idea',text:'Project name, background, and the problem it addresses are coming soon.'},{title:'My contribution',text:'My role, technical decisions, and implementation details will be added here.'},{title:'The result',text:'Screenshots, outcomes, and verified demo or source links will be added when the project details are ready.'}],
  },
  communications: {
    title:'Language Project 01',category:'LANGUAGE PROJECT',intro:'A place for a project that puts language into practice: the context, the work, and what came out of it.',
    sections:[{title:'The context',text:'Project name, language, date, and background are coming soon.'},{title:'What I did',text:'The work, intended audience, and my contribution will be described here.'},{title:'The outcome',text:'Selected material and links will be added once the project is ready to share.'}],
  },
};
