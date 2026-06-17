import { User } from '@/types/api';
import { create } from 'zustand';

interface AuthState {
  isLogin: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: false,
  user: null,
  isLoading: true,

  login: (userData) =>
    set({
      isLogin: true,
      user: userData,
      isLoading: false,
    }),

  logout: () =>
    set({
      isLogin: false,
      user: null,
      isLoading: false,
    }),

  setIsLoading: (isLoading) =>
    set({
      isLoading,
    }),
}));
