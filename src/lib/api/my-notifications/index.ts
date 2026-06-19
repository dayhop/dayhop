'use server';
import { serverInstance } from '../instance';
import { safeApi } from '../safeApi';
import type { ApiResult } from '../result';
import * as T from './type';

export const getMyNotifications = async ({
  cursorId,
  size,
}: T.GetMyNotificationsParams): Promise<ApiResult<T.GetMyNotificationsResponse>> =>
  safeApi(() =>
    serverInstance.get<T.GetMyNotificationsResponse>('/my-notifications', {
      params: { cursorId, size },
    })
  );

export const deleteMyNotification = async ({
  notificationId,
}: T.DeleteMyNotificationParams): Promise<ApiResult<void>> =>
  safeApi(() => serverInstance.delete<void>(`/my-notifications/${notificationId}`));
