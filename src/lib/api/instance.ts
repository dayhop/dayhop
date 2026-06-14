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

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await postRefreshToken();
        return serverInstance(originalRequest);
      } catch (refreshError) {
        (await cookies()).delete('accessToken');
        (await cookies()).delete('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
