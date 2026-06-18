'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProfileCard } from '@/components/blocks/ProfileCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import ChevronLeft from '@/assets/icon/ChevronLeft.svg';
import { Header, Footer } from '@/components/layout';

interface PageConfig {
  title: string;
  description: string;
  action?: { label: string; href: string };
  headerClassName?: string;
  contentClassName?: string;
}

const PAGE_CONFIG: Record<string, PageConfig> = {
  '/mypage/info': {
    title: '내 정보',
    description: '닉네임이나 비밀번호를 변경할 수 있어요.',
  },
  '/mypage/reservations': {
    title: '예약 내역',
    description: '예약 내역을 확인하고 변경 및 취소할 수 있습니다.',
    contentClassName: 'px-0',
  },
  '/mypage/activities': {
    title: '내 체험 관리',
    description: '체험을 등록하거나 수정 및 삭제가 가능합니다.',
    action: { label: '체험 등록하기', href: '/activity-add' },
  },
  '/mypage/calendar': {
    title: '예약 현황',
    description: '내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.',
    contentClassName: 'px-0',
  },
};

const DEFAULT_CONTENT_CLASS = 'px-6 md:px-0';

const isSubPage = (pathname: string) => pathname !== '/mypage';
const isEditable = (pathname: string) => pathname === '/mypage' || pathname === '/mypage/info';

const PageHeader = ({
  config,
  onAction,
}: {
  config: PageConfig;
  onAction: (href: string) => void;
}) => (
  <div
    className={cn(
      'mb-6 flex flex-col justify-between gap-3 px-6 md:mb-8 md:flex-row md:items-center md:px-0 lg:mb-10',
      config.headerClassName
    )}
  >
    <div className="mt-2.5 flex flex-col gap-2.5">
      <h2 className="text-text-primary text-lg leading-[1.2] font-bold">{config.title}</h2>
      <p className="text-text-tertiary text-sm font-medium">{config.description}</p>
    </div>
    {config.action && (
      <Button
        variant="primary"
        size="md"
        className="w-auto shrink-0 px-5"
        onClick={() => onAction(config.action!.href)}
      >
        {config.action.label}
      </Button>
    )}
  </div>
);

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const subPage = isSubPage(pathname);
  const editable = isEditable(pathname);
  const pageConfig = PAGE_CONFIG[pathname];

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (pathname === '/mypage' && e.matches) {
        router.replace('/mypage/info');
      }
    };

    handleChange(mq);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [pathname, router]);

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-[980px] flex-grow px-6 py-8 md:px-[30px]">
        {/* PC / Tablet */}
        <div className="hidden md:flex md:gap-6">
          <aside className="w-[178px] shrink-0 lg:w-[290px]">
            <ProfileCard />
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {!subPage ? (
            <ProfileCard />
          ) : (
            <div>
              <button
                onClick={() => router.push('/mypage')}
                className="text-text-primary mb-4 flex items-center gap-1 text-sm font-medium"
              >
                <ChevronLeft className="h-4 w-4" />
                뒤로가기
              </button>
              {children}
            </div>
          )}
        </div>
=======
    <div className="py-8 md:pt-10 md:pb-15 lg:pb-20">
      {/* PC / Tablet */}
      <div className="mx-auto hidden max-w-260 px-7.5 md:flex md:gap-7.5 lg:gap-12.5">
        <aside className="w-55 shrink-0 lg:w-72.5">
          <ProfileCard editable={editable} />
        </aside>
        <main className="min-w-0 flex-1">
          {pageConfig && <PageHeader config={pageConfig} onAction={(href) => router.push(href)} />}
          <div className={cn(DEFAULT_CONTENT_CLASS, pageConfig?.contentClassName)}>{children}</div>
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {!subPage ? (
          <div className="px-6">
            <ProfileCard editable={editable} />
          </div>
        ) : (
          <div>
            <button
              onClick={() => router.push('/mypage')}
              className="text-text-primary mb-4 flex items-center gap-1 px-6 text-sm font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              뒤로가기
            </button>
            {pageConfig && (
              <PageHeader config={pageConfig} onAction={(href) => router.push(href)} />
            )}
            <div className={cn(DEFAULT_CONTENT_CLASS, pageConfig?.contentClassName)}>
              {children}
            </div>
          </div>
        )}
>>>>>>> 15ae9cc (refactor: mypage layout 내에 헤더와 콘텐츠 영역을 분리)
      </div>
      <Footer />
    </div>
  );
}
