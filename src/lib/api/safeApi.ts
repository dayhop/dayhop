import { isAxiosError } from 'axios';
import type { ApiResult } from './result';

const DEFAULT_MESSAGE = '요청 처리 중 오류가 발생했습니다.';

export async function safeApi<T>(fn: () => Promise<T>): Promise<ApiResult<T>> {
  try {
    return { success: true, data: await fn() };
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      return {
        success: false,
        message: error.response?.data?.message ?? DEFAULT_MESSAGE,
        status: error.response?.status,
      };
    }
    return { success: false, message: DEFAULT_MESSAGE };
  }
}
