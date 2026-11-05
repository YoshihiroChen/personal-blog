import type { OrbitElements } from '@/data/solar-system';
const TAU = Math.PI * 2;
const radians = (value:number) => value * Math.PI / 180;
export function eccentricAnomaly(meanAnomaly:number,eccentricity:number):number {
  const mean=((meanAnomaly+Math.PI)%TAU+TAU)%TAU-Math.PI;
  let eccentric=mean;
  for(let i=0;i<10;i++){
    const correction=(eccentric-eccentricity*Math.sin(eccentric)-mean)/(1-eccentricity*Math.cos(eccentric));
    eccentric-=correction;
    if(Math.abs(correction)<1e-10)break;
  }
  return eccentric;
}
/** The same focus-centred ellipse is used by both the orbit path and its body. */
export function positionOnEllipse(orbit:OrbitElements,eccentric:number):[number,number,number] {
  const x=orbit.semiMajorAxis*(Math.cos(eccentric)-orbit.eccentricity);
  const y=orbit.semiMajorAxis*Math.sqrt(1-orbit.eccentricity**2)*Math.sin(eccentric);
  const inclination=radians(orbit.inclination),node=radians(orbit.ascendingNode),argument=radians(orbit.perihelion-orbit.ascendingNode);
  const cosW=Math.cos(argument),sinW=Math.sin(argument),cosO=Math.cos(node),sinO=Math.sin(node),cosI=Math.cos(inclination),sinI=Math.sin(inclination);
  const eclipticX=(cosW*cosO-sinW*sinO*cosI)*x+(-sinW*cosO-cosW*sinO*cosI)*y;
  const eclipticY=(cosW*sinO+sinW*cosO*cosI)*x+(-sinW*sinO+cosW*cosO*cosI)*y;
  const eclipticZ=sinW*sinI*x+cosW*sinI*y;
  // Ecliptic north is Three.js +Y; preserve prograde motion and handedness.
  return [eclipticX,eclipticZ,-eclipticY];
}
export function orbitalPosition(orbit:OrbitElements,days:number):[number,number,number] {
  const mean=radians(orbit.meanAnomaly)+TAU*days/orbit.periodDays;
  return positionOnEllipse(orbit,eccentricAnomaly(mean,orbit.eccentricity));
}

/** Fit the projected ellipses instead of a large, mostly empty bounding sphere. */
export function solarOverviewDistance(aspect:number,orbits:OrbitElements[]):number {
  const elevation=35*Math.PI/180, sin=Math.sin(elevation),cos=Math.cos(elevation);
  const halfFov=Math.tan(21*Math.PI/180),margin=.84;
  let distance=25;
  for(const orbit of orbits)for(let i=0;i<128;i++){
    const [x,y,z]=positionOnEllipse(orbit,i/128*Math.PI*2);
    const depth=y*sin+z*cos,vertical=y*cos-z*sin;
    distance=Math.max(distance,depth+(Math.abs(x)+2)/(halfFov*Math.max(.2,aspect)*margin),depth+(Math.abs(vertical)+2)/(halfFov*margin));
  }
  return distance;
}

/** Decorative paths must not hide city labels or intercept celestial picking. */
export function ignoreOrbitRaycast(): void {}
