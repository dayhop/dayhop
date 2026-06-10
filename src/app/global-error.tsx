'use client';

import localFont from 'next/font/local';
import { ServerError } from '@/components/blocks/ErrorPage';
import './globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '100 900',
  display: 'swap',
});

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className={pretendard.variable}>
        <div className="flex min-h-dvh items-center justify-center">
          <ServerError onRetry={reset} />
        </div>
      </body>
    </html>
  );
}
