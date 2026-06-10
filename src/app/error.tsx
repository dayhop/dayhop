'use client';

import { ServerError } from '@/components/blocks/ErrorPage';
import type { ErrorPageProps } from '@/types/error';

export default function Error({ reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <ServerError onRetry={reset} />
    </div>
  );
}
