import instance from '@/lib/api/instance';
import {
  DeleteMyNotificationParams,
  GetMyNotificationsParams,
  GetMyNotificationsResponse,
} from '@/types/api/mynotifications-types';

// 알림 목록 조회
export const getMyNotifications = async ({
  teamId,
  cursorId,
  size,
}: GetMyNotificationsParams): Promise<GetMyNotificationsResponse> => {
  const { data } = await instance.get<GetMyNotificationsResponse>(`/${teamId}/my-notifications`, {
    params: { cursorId, size },
  });
  return data;
};

// 알림 삭제
export const deleteMyNotification = async ({
  teamId,
  notificationId,
}: DeleteMyNotificationParams): Promise<void> => {
  await instance.delete<void>(`/${teamId}/my-notifications/${notificationId}`);
};
