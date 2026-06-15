'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar } from '@/components/ui/Avatar';
import LogoIcon from '@/assets/icon/logoIcon.svg';

export const Header = () => {
  const { user, isLogin: isLoggedIn, logout, isLoading: isAuthLoading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 및 ESC 키 입력 시 닫기
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
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
