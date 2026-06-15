import type { Metadata } from 'next';

import Toast from '@/components/ui/Toast';
import { pretendard } from '@/lib/fonts';
import './globals.css';
import AuthProvider from '@/providers/AuthProvider';
import { cookies } from 'next/headers';
import { serverInstance } from '@/lib/api/instance';

export const metadata: Metadata = {
  title: 'DayHOP',
  description: '오늘의 취향을 발견하고 가볍게 HOP하는 체험 플랫폼',
};

async function getMe() {
  try {
    const cookieStore = await cookies();
    const response = await serverInstance.get('/user/me');
    return response.data;
  } catch (error) {
    return null;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-sans">
        <AuthProvider initialUser={getMe()}>
          {children}
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
