import { create } from 'zustand';

export type ThemeGroup = { main: string; subs: string[] };

type ExploreState = {
  address: string;
  theme: ThemeGroup | null;
  setAddress: (v: string) => void;
  setTheme: (v: ThemeGroup | null) => void;
  reset: () => void;
};

export const useAIExploreStore = create<ExploreState>((set) => ({
  address: '',
  theme: null,
  setAddress: (v) => set({ address: v }),
  setTheme: (v) => set({ theme: v }),
  reset: () => set({ address: '', theme: null }),
}));
