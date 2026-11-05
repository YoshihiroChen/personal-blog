export type ThemeId = 'knowledge' | 'language' | 'technology' | 'ocean' | 'lava' | 'warmth' | 'growth' | 'discovery' | 'solitude' | 'rebirth' | 'earth' | 'moon' | 'sun' | 'ice';
export type NodeState = 'locked' | 'discovered' | 'active' | 'completed' | 'future';
export interface CelestialNode {
  id: string; parentId?: string; type: 'galaxy' | 'star' | 'planet' | 'moon' | 'celestial-body' | 'region';
  name: string; english: string; description: string; themeId: ThemeId; contentId?: string; storyIds?: string[];
  children?: CelestialNode[]; since?: number; state?: NodeState;
  visual?: { radius?: number; texture?: string; atmosphere?: boolean; rotationSpeed?: number; rings?: boolean };
  orbit?: { radius: number; speed: number; inclination?: number };
}
export type StoryDate = { precision: 'year' | 'month' | 'day'; value: string; end?: string } | { precision: 'unknown' };
export interface Story {
  id: string; title: string; subtitle: string; summary: string; paragraphs: string[]; date: StoryDate;
  emotionTags: string[]; celestialNodeIds: string[]; status: 'public' | 'draft' | 'private'; demo: boolean;
}
export interface TravelPlace { id: string; name: string; english: string; country: string; latitude: number; longitude: number; description: string }
export interface TravelVisit { id: string; placeId: string; visitedAt: StoryDate; title: string; description: string; photos: { src: string; alt: string }[]; storyIds: string[]; status: 'public' | 'draft' | 'private'; demo: boolean }
export type Quality = 'low' | 'medium' | 'high';
export type Mode = 'overview' | 'knowledge' | 'emotions' | 'earth' | 'timeline' | 'works';
