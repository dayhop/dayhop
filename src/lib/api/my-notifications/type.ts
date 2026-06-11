export interface Notification {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GetMyNotificationsParams {
  cursorId?: number;
  size?: number;
}

export interface GetMyNotificationsResponse {
  cursorId: number | null;
  notifications: Notification[];
  totalCount: number;
}

export interface DeleteMyNotificationParams {
  notificationId: number;
}
