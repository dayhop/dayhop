import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { postRefreshToken } from './auth';

export const serverInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
});

serverInstance.interceptors.request.use(async (config) => {
  const token = (await cookies()).get('accessToken')?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

serverInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    //error 상태가 401: Unauthorized이고
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/tokens')
    ) {
      const cookieStore = await cookies();

      //리프레쉬 토큰도 없으면 바로 에러
      const hasRefreshToken = cookieStore.has('refreshToken');

      if (!hasRefreshToken) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        await postRefreshToken();
        return serverInstance(originalRequest);
      } catch (refreshError) {
        try {
          //delete 시도, 화면 렌더링 중이라면 에러가 발생함.
          (await cookies()).delete('accessToken');
          (await cookies()).delete('refreshToken');
        } catch (cookieError) {
          //TODO 처리 방법 ....
          console.error('서버 컴포넌트 렌더링 중... 쿠키 삭제 생략 에러');
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
