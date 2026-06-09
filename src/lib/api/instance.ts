import axios, { AxiosInstance } from 'axios';
import { showToast } from '@/utils/toast';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _skipErrorToast?: boolean;
    _retry?: boolean;
  }
  interface AxiosRequestConfig {
    _skipErrorToast?: boolean;
    _retry?: boolean;
  }
}

const API_ERROR_MESSAGES = {
  network: '네트워크 연결을 확인해주세요.',
  server: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  forbidden: '접근 권한이 없습니다.',
  notFound: '요청한 정보를 찾을 수 없습니다.',
  unknown: '알 수 없는 오류가 발생했습니다.',
} as const;

function extractServerMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data;
  if (typeof data === 'object' && data !== null && 'message' in data) {
    return String((data as { message: unknown }).message);
  }
  return null;
}

// 쿠키 관리를 위한 헬퍼 함수
function getCookie(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length >= 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }
  return undefined;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; secure; samesite=lax`;
}

function deleteCookie(name: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=lax`;
}

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
});

// 토큰 갱신 대기열을 위한 타입 및 상태 변수
interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!axios.isAxiosError(error)) {
      showToast.error(API_ERROR_MESSAGES.unknown);
      return Promise.reject(error);
    }

    if (error.config?._skipErrorToast) {
      return Promise.reject(error);
    }

    if (error.code === 'ECONNABORTED' || !error.response) {
      showToast.error(API_ERROR_MESSAGES.network);
      return Promise.reject(error);
    }

    const { status } = error.response;
    const originalRequest = error.config;

    // 401 Unauthorized 에러 대응 (Access Token 만료 시)
    if (status === 401 && originalRequest) {
      // 리프레쉬 토큰 요청 자체에서 401이 나면 즉시 로그아웃 처리
      // 리프레쉬 토큰 요청 자체에서 401이 나거나 이미 재시도한 요청인 경우 즉시 로그아웃 처리
      if (originalRequest._retry || originalRequest.url?.includes('/auth/tokens')) {
        if (typeof window !== 'undefined') {
          deleteCookie('accessToken');
          showToast.error('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest._retry = true;
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/tokens`,
          {},
          {
            withCredentials: true,
          }
        );
        const { accessToken } = response.data;
        setCookie('accessToken', accessToken, 60 * 15);
        processQueue(null, accessToken);

        // 현재 실패했던 원래 요청 재전송
        originalRequest._retry = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          deleteCookie('accessToken');
          showToast.error('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const serverMessage = extractServerMessage(error);

    if (status === 403) {
      showToast.error(serverMessage ?? API_ERROR_MESSAGES.forbidden);
    } else if (status === 404) {
      showToast.error(serverMessage ?? API_ERROR_MESSAGES.notFound);
    } else if (status >= 400 && status < 500) {
      showToast.error(serverMessage ?? API_ERROR_MESSAGES.unknown);
    } else if (status >= 500) {
      showToast.error(API_ERROR_MESSAGES.server);
    }

    return Promise.reject(error);
  }
);

export default instance;
