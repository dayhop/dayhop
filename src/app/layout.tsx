import type { Metadata } from 'next';

import Toast from '@/components/ui/Toast';
import { pretendard } from '@/lib/fonts';
import './globals.css';
import AuthProvider from '@/providers/AuthProvider';
import { serverInstance } from '@/lib/api/instance';

export const metadata: Metadata = {
  title: 'DayHOP',
  description: '오늘의 취향을 발견하고 가볍게 HOP하는 체험 플랫폼',
};

async function getMe() {
  try {
    const response = await serverInstance.get('/users/me');
    return response.data;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getMe();
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-sans">
        <AuthProvider initialUser={user}>
          {children}
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
