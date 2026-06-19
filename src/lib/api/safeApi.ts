import { isAxiosError, type AxiosResponse } from 'axios';
import type { ApiResult } from './result';

const DEFAULT_MESSAGE = '요청 처리 중 오류가 발생했습니다.';
const UNAUTHORIZED_MESSAGE = '로그인 후 이용해주세요.';

export async function safeApi<T>(fn: () => Promise<AxiosResponse<T>>): Promise<ApiResult<T>> {
  try {
    const { data } = await fn();
    return { success: true, data };
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      const status = error.response?.status;
      const message =
        status === 401 ? UNAUTHORIZED_MESSAGE : (error.response?.data?.message ?? DEFAULT_MESSAGE);
      return { success: false, message, status };
    }
    return { success: false, message: DEFAULT_MESSAGE };
  }
}

export function unwrap<T>(result: ApiResult<T>): T {
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.data;
}
