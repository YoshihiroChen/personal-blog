import type { TravelPlace, TravelVisit } from '@/types/universe';
export const places: TravelPlace[] = [
  { id: 'tokyo', name: 'Tokyo', english: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, description: 'Trains, side streets, and a thousand little versions of everyday life.' },
  { id: 'osaka', name: 'Osaka', english: 'Osaka', country: 'Japan', latitude: 34.6937, longitude: 135.5023, description: 'Taking the slower route through busy streets.' },
  { id: 'shanghai', name: 'Shanghai', english: 'Shanghai', country: 'China', latitude: 31.2304, longitude: 121.4737, description: 'A city where old and new meet across the river.' },
];
export const visits: TravelVisit[] = [
  { id: 'tokyo-2025', placeId: 'tokyo', visitedAt: { precision: 'year', value: '2025' }, title: 'The Pull of a City', description: 'Sample entry: finding new routines on the streets of Tokyo. Personal dates, photos, and stories are coming soon.', photos: [], storyIds: ['tokyo'], status: 'public', demo: true },
  { id: 'tokyo-2026', placeId: 'tokyo', visitedAt: { precision: 'month', value: '2026-03' }, title: 'Tokyo, Again', description: 'Sample entry: a familiar place can feel new on a second visit. This entry demonstrates repeat visits.', photos: [], storyIds: [], status: 'public', demo: true },
  { id: 'osaka-2023', placeId: 'osaka', visitedAt: { precision: 'year', value: '2023' }, title: 'The Warmth of Side Streets', description: 'Sample entry: saving a walk as a little point on the map.', photos: [], storyIds: [], status: 'public', demo: true },
  { id: 'shanghai-2020', placeId: 'shanghai', visitedAt: { precision: 'year', value: '2020' }, title: 'A Slow Walk by the River', description: 'Sample entry: a space for future travel notes.', photos: [], storyIds: [], status: 'public', demo: true },
];
