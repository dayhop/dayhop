'use server';
import { serverInstance } from '../instance';
import * as T from './type';

export const getMyNotifications = async ({
  cursorId,
  size,
}: T.GetMyNotificationsParams): Promise<T.GetMyNotificationsResponse> => {
  const { data } = await serverInstance.get<T.GetMyNotificationsResponse>('/my-notifications', {
    params: { cursorId, size },
  });
  return data;
};

export const deleteMyNotification = async ({
  notificationId,
}: T.DeleteMyNotificationParams): Promise<void> => {
  await serverInstance.delete<void>(`/my-notifications/${notificationId}`);
};
