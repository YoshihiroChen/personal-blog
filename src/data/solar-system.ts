/** Orbital elements: NASA/JPL approximate J2000 elements.
 * https://ssd.jpl.nasa.gov/planets/approx_pos.html
 * Distances and body radii are independently scaled for a readable overview.
 * This is an accelerated Keplerian illustration, not a live ephemeris.
 */
export interface OrbitElements {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  ascendingNode: number;
  perihelion: number;
  meanAnomaly: number;
  periodDays: number;
}
export interface SolarBody {
  nodeId: string;
  parentId: 'sun';
  semiMajorAxisAU: number;
  radius: number;
  orbit: OrbitElements;
}
export const SOLAR_DAYS_PER_SECOND = 3;
export const solarBodies: SolarBody[] = [
  { nodeId:'mercury',parentId:'sun',semiMajorAxisAU:.38709927,radius:.24,orbit:{semiMajorAxis:4.1,eccentricity:.20563593,inclination:7.004979,ascendingNode:48.330766,perihelion:77.457796,meanAnomaly:174.792527,periodDays:87.969} },
  { nodeId:'venus',parentId:'sun',semiMajorAxisAU:.72333566,radius:.46,orbit:{semiMajorAxis:6,eccentricity:.00677672,inclination:3.394676,ascendingNode:76.679843,perihelion:131.602467,meanAnomaly:50.376632,periodDays:224.701} },
  { nodeId:'earth',parentId:'sun',semiMajorAxisAU:1.00000261,radius:.5,orbit:{semiMajorAxis:8,eccentricity:.01671123,inclination:0,ascendingNode:0,perihelion:102.937682,meanAnomaly:-2.473110,periodDays:365.256} },
  { nodeId:'mars',parentId:'sun',semiMajorAxisAU:1.52371034,radius:.34,orbit:{semiMajorAxis:10.4,eccentricity:.0933941,inclination:1.849691,ascendingNode:49.559539,perihelion:-23.943630,meanAnomaly:19.390198,periodDays:686.98} },
  { nodeId:'jupiter',parentId:'sun',semiMajorAxisAU:5.202887,radius:1.25,orbit:{semiMajorAxis:14.2,eccentricity:.04838624,inclination:1.304397,ascendingNode:100.473909,perihelion:14.728480,meanAnomaly:19.667961,periodDays:4332.589} },
  { nodeId:'saturn',parentId:'sun',semiMajorAxisAU:9.53667594,radius:1.02,orbit:{semiMajorAxis:18.4,eccentricity:.05386179,inclination:2.485992,ascendingNode:113.662424,perihelion:92.598878,meanAnomaly:-42.644634,periodDays:10759.22} },
  { nodeId:'uranus',parentId:'sun',semiMajorAxisAU:19.18916464,radius:.72,orbit:{semiMajorAxis:23,eccentricity:.04725744,inclination:.772638,ascendingNode:74.016925,perihelion:170.954276,meanAnomaly:142.283828,periodDays:30685.4} },
  { nodeId:'neptune',parentId:'sun',semiMajorAxisAU:30.06992276,radius:.69,orbit:{semiMajorAxis:27,eccentricity:.00859048,inclination:1.770043,ascendingNode:131.784226,perihelion:44.964762,meanAnomaly:-100.084792,periodDays:60189} },
  // Pluto is a dwarf planet, with a visibly eccentric and inclined outer orbit.
  { nodeId:'pluto',parentId:'sun',semiMajorAxisAU:39.48211675,radius:.2,orbit:{semiMajorAxis:32,eccentricity:.2488273,inclination:17.140012,ascendingNode:110.303937,perihelion:224.068916,meanAnomaly:14.860122,periodDays:90560} },
];
export const moonOrbit: OrbitElements = {semiMajorAxis:1.35,eccentricity:.0549,inclination:5.145,ascendingNode:125.08,perihelion:318.15,meanAnomaly:115,periodDays:27.3217};
