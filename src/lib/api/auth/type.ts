import type { User } from '@/types/api';
export type { User };

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  refreshToken: string;
  accessToken: string;
}

export interface TokenResponse {
  refreshToken: string;
  accessToken: string;
}
