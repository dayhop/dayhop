export type NotificationTone = 'approved' | 'declined' | 'default';

export interface ParsedNotification {
  title: string;
  tone: NotificationTone;
  highlight: string | null;
}

export function parseNotificationContent(content: string): ParsedNotification {
  if (content.includes('승인')) {
    return { title: '예약 승인', tone: 'approved', highlight: '승인' };
  }
  if (content.includes('거절')) {
    return { title: '예약 거절', tone: 'declined', highlight: '거절' };
  }
  return { title: '알림', tone: 'default', highlight: null };
}
