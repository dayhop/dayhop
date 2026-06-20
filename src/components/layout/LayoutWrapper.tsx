'use client';

import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

const EXCLUDED_PATHS = ['/login', '/signup', '/oauth', '/map'];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded = EXCLUDED_PATHS.some((path) => pathname?.startsWith(path));

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
