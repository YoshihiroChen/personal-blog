import type { TravelPlace, TravelVisit } from '@/types/universe';
export const places: TravelPlace[] = [
  { id: 'tokyo', name: '东京', english: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, description: '电车、街角与一万种日常。' },
  { id: 'osaka', name: '大阪', english: 'Osaka', country: 'Japan', latitude: 34.6937, longitude: 135.5023, description: '在热闹的街巷里，让脚步慢下来。' },
  { id: 'shanghai', name: '上海', english: 'Shanghai', country: 'China', latitude: 31.2304, longitude: 121.4737, description: '江水两岸，是过去与未来的对话。' },
];
export const visits: TravelVisit[] = [
  { id: 'tokyo-2025', placeId: 'tokyo', visitedAt: { precision: 'year', value: '2025' }, title: '城市的另一种引力', description: '示例记录 · 在东京的街道上，收集新的日常。等待替换为真实旅行日期、照片和故事。', photos: [], storyIds: ['tokyo'], status: 'public', demo: true },
  { id: 'tokyo-2026', placeId: 'tokyo', visitedAt: { precision: 'month', value: '2026-03' }, title: '再一次，与东京相遇', description: '示例记录 · 同一个地方，也可以有不同的旅行。此条用于演示一座城市的多次到访。', photos: [], storyIds: [], status: 'public', demo: true },
  { id: 'osaka-2023', placeId: 'osaka', visitedAt: { precision: 'year', value: '2023' }, title: '街巷里的温度', description: '示例记录 · 把一次漫步，存成地球上的一个坐标。', photos: [], storyIds: [], status: 'public', demo: true },
  { id: 'shanghai-2020', placeId: 'shanghai', visitedAt: { precision: 'year', value: '2020' }, title: '沿着江边，慢慢走', description: '示例记录 · 这里等待你的旅行记忆。', photos: [], storyIds: [], status: 'public', demo: true },
];
