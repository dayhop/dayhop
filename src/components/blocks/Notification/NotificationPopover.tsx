'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import CloseIcon from '@/assets/icon/icon-close.svg';
import EmptyLogo from '@/assets/icon/empty-logo.svg';
import { NotificationItem } from './NotificationItem';
import { getMyNotifications, deleteMyNotification } from '@/lib/api/my-notifications';
import { showToast } from '@/utils/toast';
import type { Notification } from '@/lib/api/my-notifications/type';

const PAGE_SIZE = 5;

interface NotificationPopoverProps {
  onClose: () => void;
  onLoaded?: (latestCreatedAt: string | null) => void;
}

export const NotificationPopover = ({ onClose, onLoaded }: NotificationPopoverProps) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const isLoadingRef = useRef(false);
  const observerRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    let isCurrent = true;

    const fetchFirstPage = async () => {
      try {
        const res = await getMyNotifications({ size: PAGE_SIZE });
        if (!isCurrent) return;
        setNotifications(res.notifications ?? []);
        setCursorId(res.cursorId);
        setTotalCount(res.totalCount ?? 0);
        onLoaded?.(res.notifications?.[0]?.createdAt ?? null);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        if (isCurrent) setIsError(true);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchFirstPage();
    return () => {
      isCurrent = false;
    };
  }, [onLoaded]);

  useEffect(() => {
    if (!cursorId) return;

    let isCurrent = true;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoadingRef.current) return;
        isLoadingRef.current = true;
        try {
          const res = await getMyNotifications({ cursorId, size: PAGE_SIZE });
          if (!isCurrent) return;
          setNotifications((prev) => [...prev, ...(res.notifications ?? [])]);
          setCursorId(res.cursorId);
        } catch (error) {
          console.error('Failed to load more notifications:', error);
        } finally {
          isLoadingRef.current = false;
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      isCurrent = false;
      observer.disconnect();
    };
  }, [cursorId]);

  const handleDelete = async (id: number) => {
    try {
      await deleteMyNotification({ notificationId: id });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      showToast.success('알림을 삭제했어요.');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      showToast.error('알림 삭제에 실패했어요. 다시 시도해 주세요.');
    }
  };

  const handleSelect = () => {
    onClose();
    router.push('/mypage/reservations');
  };

  return (
    <div className="border-border-default absolute top-full right-0 z-50 mt-2 flex w-[368px] max-w-[calc(100vw-32px)] flex-col rounded-2xl border bg-white p-5 shadow-lg">
      {/* 헤더 */}
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

      {/* 목록 */}
      {notifications.length > 0 ? (
        <ul className="flex max-h-[360px] flex-col gap-2 overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          ))}
          {cursorId && <li ref={observerRef} className="h-4 shrink-0" />}
        </ul>
      ) : isLoading ? (
        <p className="text-text-placeholder py-10 text-center text-sm">불러오는 중...</p>
      ) : isError ? (
        <p className="text-status-danger py-10 text-center text-sm">알림을 불러오지 못했어요.</p>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <EmptyLogo width={96} height={93} className="opacity-40" />
          <p className="text-text-placeholder text-sm">새로운 알림이 없어요.</p>
        </div>
      )}
    </div>
  );
};
