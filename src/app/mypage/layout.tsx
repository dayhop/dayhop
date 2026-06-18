'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProfileCard } from '@/components/blocks/ProfileCard';
import ChevronLeft from '@/assets/icon/ChevronLeft.svg';
import { Header, Footer } from '@/components/layout';

const isSubPage = (pathname: string) => pathname !== '/mypage';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const subPage = isSubPage(pathname);

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
      </div>
      <Footer />
    </div>
  );
}
