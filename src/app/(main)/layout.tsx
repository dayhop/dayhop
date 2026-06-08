import React from 'react';
import { Footer } from '@/components/layout';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
