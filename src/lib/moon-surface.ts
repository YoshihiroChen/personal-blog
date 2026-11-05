import * as THREE from 'three';

const surfaces = new Map<number, THREE.DataTexture>();
const clamp = (value: number) => Math.max(0, Math.min(1, value));
function smooth(a: number, b: number, x: number) { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
function gridNoise(u: number, v: number, columns: number, rows: number) {
  const x = u * columns, y = v * rows, ix = Math.floor(x), iy = Math.floor(y);
  const hash = (a: number, b: number) => {
    let n = Math.imul((a + columns) % columns, 374761393) + Math.imul(b, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  };
  const fx = smooth(0, 1, x - ix), fy = smooth(0, 1, y - iy);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), fx), THREE.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), fx), fy);
}
/** A deterministic lunar study, not a geographic survey. RGB = regolith; A = relief. */
export function moonSurfaceTexture(lowDetail: boolean) {
  const width = lowDetail ? 512 : 1024, height = width / 2;
  const cached = surfaces.get(width);
  if (cached) return cached;
  const relief = new Float32Array(width * height), albedo = new Float32Array(width * height);
  // Broad, overlapping basalt basins: the near side faces +Z (u around .25).
  const seas = [[.19,.51,.085,.14],[.29,.64,.065,.10],[.33,.48,.055,.09],[.25,.37,.065,.065],[.12,.63,.045,.08],[.72,.43,.065,.12],[.8,.6,.045,.07]];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const u = x / width, v = y / (height - 1), index = y * width + x;
    const broad = gridNoise(u, v, 16, 8), medium = gridNoise(u, v, 64, 32), fine = gridNoise(u, v, 256, 128);
    let sea = 0;
    for (const [cu, cv, rx, ry] of seas) {
      const delta = Math.abs(u - cu), dx = Math.min(delta, 1 - delta) / rx, dy = (v - cv) / ry;
      sea = Math.max(sea, 1 - smooth(.3, 1.2, dx * dx + dy * dy + (broad - .5) * .65));
    }
    relief[index] = .53 + (broad - .5) * .075 + (medium - .5) * .028 - sea * .045;
    albedo[index] = .51 + (broad - .5) * .12 + (medium - .5) * .075 + (fine - .5) * .045 - sea * .23;
  }
  let seed = 8093;
  const random = () => { seed = Math.imul(seed, 1664525) + 1013904223 | 0; return (seed >>> 0) / 4294967296; };
  const crater = (u: number, v: number, radius: number) => {
    const cosLatitude = Math.max(.18, Math.sin(v * Math.PI));
    const reach = radius * 1.45, dyMax = Math.ceil(reach / Math.PI * height), dxMax = Math.ceil(reach / (2 * Math.PI * cosLatitude) * width);
    const cx = Math.floor(u * width), cy = Math.floor(v * (height - 1)), depth = .045 + radius * .2;
    for (let dy = -dyMax; dy <= dyMax; dy++) {
      const y = cy + dy;
      if (y < 1 || y >= height - 1) continue;
      for (let dx = -dxMax; dx <= dxMax; dx++) {
        const distance = Math.hypot(dx / width * Math.PI * 2 * cosLatitude, dy / height * Math.PI) / radius;
        if (distance > 1.45) continue;
        const x = (cx + dx + width) % width, index = y * width + x;
        const bowl = 1 - smooth(.32, .94, distance);
        const rim = Math.exp(-Math.pow((distance - 1) / .115, 2));
        const peak = radius > .07 ? Math.exp(-distance * distance / .025) * .24 : 0;
        relief[index] += depth * (-bowl + rim * .62 + peak);
        albedo[index] += rim * .105 - bowl * .025 + (1 - smooth(1.05, 1.45, distance)) * .008;
      }
    }
  };
  // Large, readable formations plus a dense secondary crater field.
  crater(.255, .49, .12); crater(.39, .29, .085); crater(.10, .36, .075); crater(.30, .78, .095);
  for (let i = 0; i < (lowDetail ? 300 : 650); i++) {
    const u = random(), v = Math.acos(random() * 1.84 - .92) / Math.PI, radius = .009 + Math.pow(random(), 3.4) * .095;
    crater(u, v, radius);
  }
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < relief.length; i++) {
    const grey = clamp(albedo[i]);
    data[i * 4] = Math.round(grey * 255);
    data[i * 4 + 1] = Math.round(grey * .985 * 255);
    data[i * 4 + 2] = Math.round(grey * .96 * 255);
    data[i * 4 + 3] = Math.round(clamp(relief[i]) * 255);
  }
  // Keep one texture per resolution for the lifetime of this scene module.
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  surfaces.set(width, texture);
  return texture;
}
