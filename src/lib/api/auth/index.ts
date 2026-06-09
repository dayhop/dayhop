import instance from '../instance';
import type { LoginRequest, LoginResponse, TokenResponse } from './type';

export const postLogin = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await instance.post<LoginResponse>('/auth/login', body);
  return data;
};

export const postRefreshToken = async (): Promise<TokenResponse> => {
  const { data } = await instance.post<TokenResponse>(
    '/auth/tokens',
    {},
    { withCredentials: true }
  );
  return data;
};
