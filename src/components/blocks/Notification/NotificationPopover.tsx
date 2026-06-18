'use client';

import CloseIcon from '@/assets/icon/icon-close.svg';
import EmptyLogo from '@/assets/icon/empty-logo.svg';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '@/lib/api/my-notifications/type';

interface NotificationPopoverProps {
  notifications: Notification[];
  totalCount: number;
  onClose: () => void;
  onSelect: (notification: Notification) => void;
  onDelete: (id: number) => void;
}

export const NotificationPopover = ({
  notifications,
  totalCount,
  onClose,
  onSelect,
  onDelete,
}: NotificationPopoverProps) => {
  return (
    <div className="border-border-default absolute top-full right-0 z-50 mt-2 flex w-[368px] max-w-[calc(100vw-32px)] flex-col rounded-2xl border bg-white p-5 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-text-primary text-lg font-bold">알림 {totalCount}개</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="알림 닫기"
          className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      {notifications.length > 0 ? (
        <ul className="flex max-h-[360px] flex-col gap-2 overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <EmptyLogo width={96} height={93} className="opacity-40" />
          <p className="text-text-placeholder text-sm">새로운 알림이 없어요.</p>
        </div>
      )}
    </div>
  );
};
