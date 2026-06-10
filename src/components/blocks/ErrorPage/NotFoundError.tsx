'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import Error404 from '@/assets/icon/Error404.svg';

export function NotFoundError() {
  const router = useRouter();

  const handleBack = () => {
    if (document.referrer) {
      const referrerUrl = new URL(document.referrer);
      if (referrerUrl.origin === window.location.origin) {
        router.back();
        return;
      }
    }
    router.push('/');
  };

  return (
    <div className="flex w-[320px] max-w-[calc(100vw-32px)] flex-col items-center gap-7 md:w-[400px]">
      <ErrorState Illustration={Error404} message="페이지를 찾을 수 없어요." />
      <div className="grid w-full grid-cols-2 gap-3">
        <Button variant="secondary" size="md" className="min-w-0 px-4 md:px-8" onClick={handleBack}>
          뒤로가기
        </Button>
        <Link href="/" className="min-w-0">
          <Button variant="primary" size="md" className="px-4 md:px-8">
            홈으로 가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
