import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

export function EmptyReservationList() {
  return (
    <div className="flex w-45 flex-col items-center justify-center gap-7 text-lg">
      <EmptyState message="아직 예약한 체험이 없어요." />
      <Link href="/products">
        <Button variant="primary">둘러보기</Button>
      </Link>
    </div>
  );
}
