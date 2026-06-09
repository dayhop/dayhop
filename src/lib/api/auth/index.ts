import instance from '../instance';
import * as T from './type';

export const postLogin = async (body: T.LoginRequest): Promise<T.LoginResponse> => {
  const { data } = await instance.post<T.LoginResponse>('/auth/login', body);
  return data;
};

export const postRefreshToken = async (): Promise<T.TokenResponse> => {
  const { data } = await instance.post<T.TokenResponse>(
    '/auth/tokens',
    {},
    { withCredentials: true }
  );
  return data;
};
