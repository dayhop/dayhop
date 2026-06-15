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

  useEffect(() => {
    if (initialUser) {
      login(initialUser); // 서버에서 넘어온 정보로 스토어 동기화
    }
  }, [initialUser, login]);

  return <>{children}</>;
}
