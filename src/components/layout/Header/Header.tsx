'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { showToast } from '@/utils/toast';
import { Avatar } from '@/components/ui/Avatar';
import LogoIcon from '@/assets/icon/logoIcon.svg';
import IconBell from '@/assets/icon/icon_bell.svg';
import IconBellDot from '@/assets/icon/icon_bell_dot.svg';
import { getMyNotifications, deleteMyNotification } from '@/lib/api/my-notifications';
import type { Notification } from '@/lib/api/my-notifications/type';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { NotificationPopover } from '@/components/blocks/Notification';

export const Header = () => {
  const router = useRouter();
  const { user, isLogin: isLoggedIn, logout, isLoading: isAuthLoading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // 알림 목록 조회 및 30초 폴링
  useEffect(() => {
    if (!isLoggedIn || !user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let isCurrent = true;

    const fetchNotifications = async () => {
      try {
        const res = await getMyNotifications({ size: 10 });
        if (isCurrent) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.totalCount || 0);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      isCurrent = false;
      clearInterval(interval);
    };
  }, [isLoggedIn, user]);

  // 드롭다운 외부 클릭 및 ESC 닫기 처리
  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false), isDropdownOpen);
  useOutsideClick(notificationRef, () => setIsNotificationOpen(false), isNotificationOpen);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await deleteMyNotification({ notificationId: id });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      showToast.success('알림을 삭제했어요.');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      showToast.error('알림 삭제에 실패했어요. 다시 시도해 주세요.');
    }
  };

  // 알림 클릭 시 내 예약 내역으로 이동
  const handleSelectNotification = () => {
    setIsNotificationOpen(false);
    router.push('/mypage/reservations');
  };

  return (
    <header className="border-border-default bg-bg sticky top-0 z-40 flex w-full items-center justify-center border-b py-2">
      <div className="flex w-full max-w-[1200px] items-center justify-between px-6 md:px-12">
        {/* 로고 */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
          <LogoIcon className="h-[60px] w-[62px]" role="img" aria-label="DayHOP 로고" />
        </Link>

        {/* 우측 영역 */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          {isAuthLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-50" />
          ) : isLoggedIn && user ? (
            // 분기: 로그인 상태
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {/* 알림 벨 버튼 및 알림 드롭다운 */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                  aria-expanded={isNotificationOpen}
                  aria-label="알림"
                >
                  {unreadCount > 0 ? (
                    <IconBellDot className="h-6 w-6" />
                  ) : (
                    <IconBell className="h-6 w-6" />
                  )}
                </button>

                {isNotificationOpen && (
                  <NotificationPopover
                    notifications={notifications}
                    totalCount={unreadCount}
                    onClose={() => setIsNotificationOpen(false)}
                    onSelect={handleSelectNotification}
                    onDelete={handleDeleteNotification}
                  />
                )}
              </div>

              {/* 유저 프로필 및 드롭다운 */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="hover:bg-bg-surface flex cursor-pointer items-center gap-2 rounded-full p-1 transition-colors md:gap-3 md:px-3 md:py-1.5"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="menu"
                >
                  <Avatar src={user.profileImageUrl || undefined} size="sm" />
                  <span className="text-text-primary hidden text-sm font-semibold md:inline-block">
                    {user.nickname}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div
                    role="menu"
                    className="border-border-default bg-bg absolute top-full right-0 z-50 mt-2 flex min-w-[140px] flex-col gap-1 rounded-xl border p-1.5 shadow-md"
                  >
                    <Link
                      href="/mypage"
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-text-secondary hover:bg-bg-surface/50 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                      role="menuitem"
                    >
                      마이 페이지
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-status-danger hover:bg-status-danger/10 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors"
                      role="menuitem"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // 분기: 비로그인 상태
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              <Link
                href="/login"
                className="text-text-primary hover:text-text-secondary text-sm font-semibold transition-colors md:text-base"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-text-primary hover:text-text-secondary text-sm font-semibold transition-colors md:text-base"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
