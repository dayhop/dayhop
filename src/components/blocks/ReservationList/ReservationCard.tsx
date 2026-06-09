import { Button } from '@/components/ui/Button';
import { Status } from '@/types/api/activities-types';
import { totalPriceToString } from '@/utils/priceFormat';
import Image from 'next/image';

interface ReservationCardProps {
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  totalPrice: number;
  status: Status;
  headCount: number;
  bannerImageUrl: string;
}
export function ReservationCard({
  title,
  startTime,
  endTime,
  date,
  totalPrice,
  status,
  headCount,
  bannerImageUrl,
}: ReservationCardProps) {
  return (
    <div className="flex w-full max-w-160 min-w-82 flex-col gap-3">
      <div className="text-text-secondary font-bold lg:hidden">{date}</div>
      <div className="flex h-37 w-full items-stretch">
        <div className="relative z-10 flex flex-1 flex-col justify-end gap-2 rounded-3xl bg-white p-5 text-sm shadow-[0_-8px_20px_0_rgba(0,0,0,0.05)]">
          {/* TODO: 뱃지 컴포넌트로 변경 필요 */}
          <div>{status}</div>
          <div className="flex flex-col gap-1">
            <div className="truncate font-bold">{title}</div>
            <div className="text-text-tertiary hidden text-[13px] lg:flex">{`${date} · ${startTime} ~ ${endTime}`}</div>
            <div className="text-text-tertiary text-[13px] lg:hidden">{`${startTime} ~ ${endTime}`}</div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <div className="text-[16px] font-bold">{totalPriceToString(totalPrice)}</div>
              <div className="text-text-placeholder">{headCount}명</div>
            </div>
            {status === 'pending' && (
              <div className="hidden gap-2 lg:flex">
                <Button
                  size="sm"
                  className="border-bg-surface border bg-white px-2.5 whitespace-nowrap text-gray-600"
                >
                  예약변경
                </Button>
                <Button
                  size="sm"
                  className="bg-gray-50 px-2.5 py-1.5 whitespace-nowrap text-gray-600"
                >
                  예약취소
                </Button>
              </div>
            )}
            {status === 'completed' && (
              <Button
                size="sm"
                className="bg-primary hidden w-fit px-2.5 py-1.5 whitespace-nowrap lg:flex"
              >
                후기 작성
              </Button>
            )}
          </div>
        </div>
        <div className="relative -ml-5 aspect-square shrink-0 overflow-hidden rounded-r-3xl">
          <Image src={bannerImageUrl} alt="배너 이미지" fill className="object-cover" />
        </div>
      </div>
      {status === 'pending' && (
        <div className="flex w-full gap-3 lg:hidden">
          <Button size="sm" variant="secondary">
            예약 변경
          </Button>
          <Button size="sm" className="bg-gray-50 text-gray-600">
            예약 취소
          </Button>
        </div>
      )}
      {status === 'completed' && (
        <Button size="sm" className="bg-primary w-full px-2.5 py-1.5 whitespace-nowrap lg:hidden">
          후기 작성
        </Button>
      )}
    </div>
  );
}
