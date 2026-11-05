import type { StoryDate } from '@/types/universe';
export function dateLabel(date: StoryDate): string {
  if (date.precision === 'unknown') return '日期待补充';
  return date.end ? `${date.value} — ${date.end}` : date.value;
}
export function visibleInYear(date: StoryDate, year: number): boolean { return date.precision === 'unknown' || Number(date.value.slice(0, 4)) <= year; }
// Matches Three.js SphereGeometry UV orientation for an equirectangular map.
export function latLngToVector(latitude: number, longitude: number, radius = 1): [number, number, number] {
  const lat = latitude * Math.PI / 180, lng = longitude * Math.PI / 180;
  return [radius * Math.cos(lat) * Math.cos(lng), radius * Math.sin(lat), -radius * Math.cos(lat) * Math.sin(lng)];
}

export function earthFocusRotation(latitude: number, longitude: number): [number, number, number] {
  return [latitude * Math.PI / 180, -longitude * Math.PI / 180 - Math.PI / 2, 0];
}
