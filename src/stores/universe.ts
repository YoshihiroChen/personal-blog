import { create } from 'zustand';
import type { Mode, Quality } from '@/types/universe';
import { nodeById, ancestors } from '@/data/universe';
interface UniverseState {
  solarExploring: boolean; beginExploration: () => void;
  introComplete: boolean; interfaceVisible: boolean; toggleInterface: () => void;
  mode: Mode; focusedId: string; selectedId: string | null; activeStoryId: string | null; selectedPlaceId: string | null;
  year: number; quality: Quality; reducedMotion: boolean; audioEnabled: boolean; flying: boolean;
  explore: (id: string) => void; navigate: (mode: Mode) => void; back: () => void;
  patch: (state: Partial<Omit<UniverseState, 'explore' | 'navigate' | 'back' | 'patch' | 'toggleInterface' | 'beginExploration'>>) => void;
}
export const useUniverse = create<UniverseState>((set, get) => ({
  solarExploring: false,
  beginExploration: () => set({ solarExploring: true, introComplete: true, interfaceVisible: true, mode: 'overview', focusedId: 'universe', selectedId: null, activeStoryId: null, selectedPlaceId: null }),
  introComplete: false, interfaceVisible: false,
  toggleInterface: () => set(state => ({ interfaceVisible: !state.interfaceVisible, introComplete: true })),
  mode: 'overview', focusedId: 'universe', selectedId: null, activeStoryId: null, selectedPlaceId: null,
  year: 2026, quality: 'medium', reducedMotion: false, audioEnabled: false, flying: false,
  patch: state => set(state),
  explore: id => {
    const node = nodeById[id]; if (!node) return;
    const path=ancestors(id).map(n=>n.id);
    set({ introComplete: true, interfaceVisible: true, focusedId: id, selectedId: id, activeStoryId: null, selectedPlaceId: null, mode: id === 'earth' ? 'earth' : path.includes('knowledge') ? 'knowledge' : path.includes('emotions') ? 'emotions' : 'overview' });
  },
  navigate: mode => set({ solarExploring: false, introComplete: true, interfaceVisible: true, mode, focusedId: mode === 'knowledge' ? 'knowledge' : mode === 'emotions' ? 'emotions' : mode === 'earth' ? 'earth' : 'universe', selectedId: mode === 'knowledge' ? 'knowledge' : mode === 'earth' ? 'earth' : null, activeStoryId: null, selectedPlaceId: null }),
  back: () => {
    const parent = nodeById[get().focusedId]?.parentId ?? 'universe';
    set({ introComplete: true, interfaceVisible: true, focusedId: parent, selectedId: parent === 'universe' || parent === 'emotions' ? null : parent, activeStoryId: null, selectedPlaceId: null, mode: parent === 'universe' ? 'overview' : parent === 'earth' ? 'earth' : parent === 'emotions' ? 'emotions' : get().mode });
  },
}));
