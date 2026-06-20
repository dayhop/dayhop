'use server';

import { cookies } from 'next/headers';
import { serverInstance } from '../instance';
import { safeApi } from '../safeApi';
import type { ApiResult } from '../result';
import * as T from './type';

export const postLogin = async (body: T.LoginRequest): Promise<ApiResult<T.LoginResponse>> => {
  const result = await safeApi(() => serverInstance.post<T.LoginResponse>('/auth/login', body));

  if (result.success) {
    (await cookies()).set('accessToken', result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    (await cookies()).set('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return result;
};

export const postRefreshToken = async (): Promise<T.TokenResponse> => {
  const refreshToken = (await cookies()).get('refreshToken')?.value;
  const { data } = await serverInstance.post<T.TokenResponse>(
    '/auth/tokens',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
  try {
    (await cookies()).set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    //RT o, AT x
  } catch (cookieError) {
    //TODO: 에러처리방법
    console.error('서버 컴포넌트 렌더링 중이라 쿠키 갱신 생략됨 (미들웨어가 처리함)');
  }

  return data;
};

export const postLogout = async () => {
  (await cookies()).delete('accessToken');
  (await cookies()).delete('refreshToken');
  return;
};
