import type { Metadata } from 'next';

import localFont from 'next/font/local';
import Toast from '@/components/ui/Toast';
import { AuthProvider } from '@/contexts/AuthContext';
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
    <html lang="ko" className={pretendard.variable}>
      <body className="font-sans">
        <AuthProvider>
          {children}
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
