import type { Metadata } from 'next';

import Toast from '@/components/ui/Toast';
import { pretendard } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'DayHOP',
  description: '오늘의 취향을 발견하고 가볍게 HOP하는 체험 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-sans">
        {children}
        <Toast />
      </body>
    </html>
  );
}
