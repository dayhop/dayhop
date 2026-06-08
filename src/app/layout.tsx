import type { Metadata } from 'next';

import localFont from 'next/font/local';
import Toast from '@/components/ui/Toast';
import { FooterWrapper } from '@/components/layout';
import './globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '100 900',
  display: 'swap',
});

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
    <html lang="ko">
      <body className={pretendard.variable}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow">{children}</main>
          <FooterWrapper />
        </div>
        <Toast />
      </body>
    </html>
  );
}
