'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const MyActivitiesHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-text-primary text-2xl font-bold">내 체험 관리</h2>
        <p className="text-text-tertiary mt-1 text-sm">
          체험을 등록하거나 수정 및 삭제가 가능합니다.
        </p>
      </div>
      <Button
        variant="primary"
        size="md"
        className="w-auto shrink-0 px-5"
        onClick={() => router.push('/activity-add')}
      >
        체험 등록하기
      </Button>
    </div>
  );
};
