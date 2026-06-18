'use client';

import { Fragment } from 'react';

import CloseIcon from '@/assets/icon/icon-close.svg';
import { cn } from '@/utils/cn';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { parseNotificationContent, type NotificationTone } from '@/utils/parseNotificationContent';
import type { Notification } from '@/lib/api/my-notifications/type';

interface NotificationItemProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
  onDelete: (id: number) => void;
}

const toneTextClass: Record<NotificationTone, string> = {
  approved: 'text-primary-500',
  declined: 'text-red-500',
  default: '',
};

const renderContent = (content: string, highlight: string | null, toneClass: string) => {
  if (!highlight) return content;

  const parts = content.split(highlight);
  return parts.map((part, index) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 && (
        <span className={cn('font-medium', toneClass)}>{highlight}</span>
      )}
    </Fragment>
  ));
};

export const NotificationItem = ({ notification, onSelect, onDelete }: NotificationItemProps) => {
  const { title, tone, highlight } = parseNotificationContent(notification.content);

  return (
    <li className="group relative">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(notification)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(notification);
          }
        }}
        className={cn(
          'flex cursor-pointer flex-col gap-1 rounded-xl px-4 py-3 transition-colors',
          tone === 'approved' ? 'bg-primary-100' : 'hover:bg-gray-25 bg-white'
        )}
      >
        <div className="flex items-center justify-between gap-2 pr-5">
          <span className="text-text-primary text-sm font-bold">{title}</span>
          <span className="text-text-placeholder shrink-0 text-xs">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">
          {renderContent(notification.content, highlight, toneTextClass[tone])}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDelete(notification.id)}
        aria-label="알림 삭제"
        className="absolute top-0 right-0 block cursor-pointer p-2 opacity-50 transition-opacity hover:opacity-100 md:hidden md:group-hover:block"
      >
        <CloseIcon className="h-5 w-5 md:h-4 md:w-4" />
      </button>
    </li>
  );
};
