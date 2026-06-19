'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar } from '@/components/ui/Avatar';
import LogoIcon from '@/assets/icon/logoIcon.svg';
import IconBell from '@/assets/icon/icon_bell.svg';
import IconBellDot from '@/assets/icon/icon_bell_dot.svg';
import { getMyNotifications } from '@/lib/api/my-notifications';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { NotificationPopover } from '@/components/blocks/Notification';

export const Header = () => {
  const { user, isLogin: isLoggedIn, logout, isLoading: isAuthLoading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const lastSeenKey = user ? `notification:lastSeenAt:${user.id}` : null;

  useEffect(() => {
    if (!isLoggedIn || !user || !lastSeenKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasUnread(false);
      return;
    }

    let isCurrent = true;
    let interval: ReturnType<typeof setInterval> | undefined;

    const check = async () => {
      const res = await getMyNotifications({ size: 1 });
      if (!isCurrent || !res.success) return;
      const latest = res.data.notifications?.[0]?.createdAt ?? null;
      const lastSeen = localStorage.getItem(lastSeenKey);
      setHasUnread(!!latest && (!lastSeen || new Date(latest) > new Date(lastSeen)));
    };

    const start = () => {
      if (interval) clearInterval(interval);
      check();
      interval = setInterval(check, 30000);
    };

    const stop = () => {
      if (interval) clearInterval(interval);
      interval = undefined;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isCurrent = false;
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isLoggedIn, user, lastSeenKey]);

  // 드롭다운 외부 클릭 및 ESC 닫기 처리
  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false), isDropdownOpen);
  useOutsideClick(notificationRef, () => setIsNotificationOpen(false), isNotificationOpen);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const markSeen = useCallback(
    (latestCreatedAt: string | null) => {
      if (latestCreatedAt && lastSeenKey) {
        localStorage.setItem(lastSeenKey, latestCreatedAt);
      }
      setHasUnread(false);
    },
    [lastSeenKey]
  );

  const handleBellClick = () => {
    const next = !isNotificationOpen;
    setIsNotificationOpen(next);
    if (next) setHasUnread(false);
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
                  onClick={handleBellClick}
                  className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                  aria-expanded={isNotificationOpen}
                  aria-label="알림"
                >
                  {hasUnread ? (
                    <IconBellDot className="h-6 w-6" />
                  ) : (
                    <IconBell className="h-6 w-6" />
                  )}
                </button>

                {isNotificationOpen && (
                  <NotificationPopover
                    onClose={() => setIsNotificationOpen(false)}
                    onLoaded={markSeen}
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
