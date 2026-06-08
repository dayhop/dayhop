'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export const FooterWrapper = () => {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  if (isAuthRoute) return null;
  return <Footer />;
};
export default FooterWrapper;
