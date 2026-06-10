import type { User } from '@/types/api';

export type OauthProvider = 'google' | 'kakao';

export interface CreateOauthAppRequest {
  appKey: string;
  provider: OauthProvider;
}

export interface CreateOauthAppResponse {
  id: number;
  teamId: string;
  appKey: string;
  provider: OauthProvider;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpWithOauthRequest {
  nickname: string;
  redirectUri?: string;
  token: string;
}

export interface SignUpWithOauthResponse {
  user: User;
  refreshToken: string;
  accessToken: string;
}

export interface SignInWithOauthRequest {
  redirectUri?: string;
  token: string;
}

export type SignInWithOauthResponse = SignUpWithOauthResponse;
