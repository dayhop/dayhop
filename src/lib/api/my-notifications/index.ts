import instance from '../instance';
import type {
  DeleteMyNotificationParams,
  GetMyNotificationsParams,
  GetMyNotificationsResponse,
} from './type';

export const getMyNotifications = async ({
  cursorId,
  size,
}: GetMyNotificationsParams): Promise<GetMyNotificationsResponse> => {
  const { data } = await instance.get<GetMyNotificationsResponse>('/my-notifications', {
    params: { cursorId, size },
  });
  return data;
};

export const deleteMyNotification = async ({
  notificationId,
}: DeleteMyNotificationParams): Promise<void> => {
  await instance.delete<void>(`/my-notifications/${notificationId}`);
};
