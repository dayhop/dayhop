'use client';
import { User } from '@/types/api';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User;
}

export default function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const login = useAuthStore((state) => state.login);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    if (initialUser) {
      login(initialUser);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
