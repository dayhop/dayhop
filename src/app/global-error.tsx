'use client';

import { ServerError } from '@/components/blocks/ErrorPage';
import { pretendard } from '@/lib/fonts';
import './globals.css';

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
