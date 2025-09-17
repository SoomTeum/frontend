import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user?: { id: string; name: string } | null;
  setToken: (t: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (t) => set({ token: t }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth' },
  ),
);

export const useIsAuthed = () => !!useAuthStore((s) => s.token);
