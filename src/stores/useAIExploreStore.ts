import { create } from 'zustand';

export type ThemeGroup = { main: string; subs: string[] };

type ExploreState = {
  address: string;
  theme: ThemeGroup | null;
  distanceKm: number | null;
  setAddress: (v: string) => void;
  setTheme: (v: ThemeGroup | null) => void;
  setDistanceKm: (v: number | null) => void;
  reset: () => void;
};

export const useAIExploreStore = create<ExploreState>((set) => ({
  address: '',
  theme: null,
  distanceKm: null,
  setAddress: (v) => set({ address: v }),
  setTheme: (v) => set({ theme: v }),
  setDistanceKm: (v) => set({ distanceKm: v }),
  reset: () => set({ address: '', theme: null, distanceKm: null }),
}));
