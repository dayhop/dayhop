'use client';

import Link from 'next/link';
import FacebookIcon from '@/assets/icon/icon_facebook.svg';
import InstagramIcon from '@/assets/icon/icon_instagram.svg';
import XIcon from '@/assets/icon/icon_X.svg';
import GithubIcon from '@/assets/icon/icon_github.svg';
import ShareIcon from '@/assets/icon/ShareIcon.svg';
import { showToast } from '@/utils/toast';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleShare = (platform: 'facebook' | 'x' | 'kakao') => {
    if (typeof window === 'undefined') return;
    const currentUrl = window.location.href;

    if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else if (platform === 'x') {
      window.open(
        `https://x.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const handleClickShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DayHOP - 나만의 로컬 경험',
          text: '장소를 공유합니다.',
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        showToast.error('공유에 실패했습니다.');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast.success('링크가 클립보드에 복사되었습니다. ');
      } catch {
        showToast.error('클립보드 복사 실패');
      }
    }
  };

  return (
    <footer className="border-border-default bg-bg w-full border-t py-8 md:py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 md:flex-row md:gap-0">
        {/* Copyright */}
        <div className="text-text-tertiary text-sm font-normal">©codeit - {currentYear}</div>

        {/* Links */}
        <div className="text-text-tertiary flex items-center gap-4 text-sm font-normal">
          <Link
            href="/privacy"
            className="hover:text-text-primary text-text-secondary transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/faq" className="hover:text-text-primary transition-colors">
            FAQ
          </Link>
        </div>

        {/* SNS Icons */}
        <div className="text-text-placeholder flex items-center gap-5">
          <a
            href="https://github.com/dayhop/dayhop"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/dayhop2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => handleShare('facebook')}
            className="hover:text-text-secondary cursor-pointer transition-colors"
            aria-label="Facebook으로 공유"
          >
            <FacebookIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => handleShare('x')}
            className="hover:text-text-secondary cursor-pointer transition-colors"
            aria-label="X로 공유"
          >
            <XIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleClickShare}
            className="hover:text-text-secondary cursor-pointer transition-colors"
            aria-label="공유"
          >
            <ShareIcon className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>
    </footer>
  );
};
