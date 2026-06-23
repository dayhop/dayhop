import type { Metadata } from 'next';

import Toast from '@/components/ui/Toast';
import { pretendard } from '@/lib/fonts';
import './globals.css';
import AuthProvider from '@/providers/AuthProvider';
import { serverInstance } from '@/lib/api/instance';
import { LayoutWrapper } from '@/components/layout';

export const metadata: Metadata = {
  metadataBase: new URL('https://dayhop-amber.vercel.app'),
  title: 'DayHOP',
  description: '오늘의 취향을 발견하고 가볍게 HOP하는 체험 플랫폼',
  openGraph: {
    title: 'DayHOP',
    description: '오늘의 취향을 발견하고 가볍게 HOP하는 체험 플랫폼',
    images: {
      url: '/images/meta_data_image.png',
      width: 1200,
      height: 630,
      alt: 'DayHOP 서비스 소개 이미지',
    },
  },
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
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
