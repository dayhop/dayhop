import { User } from '@/types/api';
import { create } from 'zustand';

interface AuthState {
  isLogin: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: false,
  user: null,

  login: (userData) =>
    set({
      isLogin: true,
      user: userData,
    }),

  logout: () =>
    set({
      isLogin: false,
      user: null,
    }),
}));
