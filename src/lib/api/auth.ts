import instance from './instance';

import type { LoginRequest, LoginResponse, TokenResponse } from '@/types/api/auth';

export const postLogin = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await instance.post<LoginResponse>('/auth/login', body);

  return data;
};

export const refreshToken = async (): Promise<TokenResponse> => {
  const { data } = await instance.post<TokenResponse>('/auth/tokens');

  return data;
};
