'use client';

import { ServerError } from '@/components/blocks/ErrorPage';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <ServerError onRetry={reset} />
    </div>
  );
}
