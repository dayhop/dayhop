import type { ReactNode } from 'react';

import { Header, Footer } from '@/components/layout';

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-grow">{children}</div>

      <Footer />
    </div>
  );
}
