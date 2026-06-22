import { Button } from '@/components/ui/Button';
import { ReservationStateBadge } from '@/components/ui/ReservationList';
import { Reservation } from '@/lib/api/my-reservations/type';
import { totalPriceToString } from '@/utils/priceFormat';
import Image from 'next/image';
import { ReviewFormModal } from '../ReviewForm';
import { ScheduleChangeModal } from './ScheduleChangeModal';
import { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { showToast } from '@/utils/toast';
import defaultThumbnail from '@/assets/images/card-thumnail.png';

interface ReservationCardProps {
  data: Reservation;
  onDelete: (id: number) => void;
}
export function ReservationCard({ data, onDelete }: ReservationCardProps) {
  const { activity, startTime, endTime, date, totalPrice, status, headCount, id, reviewSubmitted } =
    data;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState<boolean>(false);
  const [imgError, setImgError] = useState(false);
  const cardImg = imgError || !activity.bannerImageUrl ? defaultThumbnail : activity.bannerImageUrl;

  const handleClickReservationDelete = async (id: number) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id, status: 'canceled' }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast.error(data.message ?? '예약 취소에 실패했습니다.');
        return;
      }
      showToast.success('예약이 취소되었습니다.');
      setIsDeleteModalOpen(false);
      onDelete(id);
    } catch {
      showToast.error('예약 취소에 실패했습니다.');
    }
  };

  return (
    <div className="mt-5 flex w-full max-w-160 min-w-0 flex-col gap-3">
      {/*모달*/}
      {isReviewModalOpen && (
        <ReviewFormModal reservation={data} onClose={() => setIsReviewModalOpen(false)} />
      )}
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          message="예약을 취소하시겠습니까? (취소 시 복구 불가)"
          onConfirm={() => handleClickReservationDelete(id)}
        />
      )}
      {isChangeModalOpen && (
        <ScheduleChangeModal
          isOpen={isChangeModalOpen}
          onClose={() => setIsChangeModalOpen(false)}
          reservation={data}
        />
      )}

      <div className="text-text-secondary font-bold lg:hidden">{date}</div>
      <div className="flex h-34 w-full items-stretch lg:h-43">
        <div className="relative z-10 flex flex-1 flex-col justify-end gap-2 rounded-3xl bg-white p-5 text-sm shadow-[0_-8px_20px_0_rgba(0,0,0,0.05)]">
          <ReservationStateBadge reservationState={status} />
          <div className="flex flex-col gap-1">
            <div className="truncate font-bold">{activity.title}</div>
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
                  onClick={() => setIsChangeModalOpen(true)}
                >
                  예약변경
                </Button>
                <Button
                  size="sm"
                  className="bg-gray-50 px-2.5 py-1.5 whitespace-nowrap text-gray-600"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  예약취소
                </Button>
              </div>
            )}
            {status === 'completed' &&
              (reviewSubmitted ? (
                <Button
                  size="sm"
                  disabled
                  className="hidden w-fit cursor-default bg-gray-100 px-2.5 py-1.5 whitespace-nowrap text-gray-400 lg:flex"
                >
                  작성 완료
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-primary hidden w-fit px-2.5 py-1.5 whitespace-nowrap lg:flex"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  후기 작성
                </Button>
              ))}
          </div>
        </div>
        <div className="relative -ml-5 aspect-square shrink-0 overflow-hidden rounded-r-3xl">
          <Image
            src={cardImg}
            alt="배너 이미지"
            fill
            sizes="(min-width: 1024px) 280px, 136px"
            quality={80}
            className="object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      </div>
      {status === 'pending' && (
        <div className="flex w-full gap-3 lg:hidden">
          <Button size="sm" variant="secondary" onClick={() => setIsChangeModalOpen(true)}>
            예약 변경
          </Button>
          <Button
            size="sm"
            className="bg-gray-50 text-gray-600"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            예약 취소
          </Button>
        </div>
      )}
      {status === 'completed' &&
        (reviewSubmitted ? (
          <Button
            size="sm"
            disabled
            className="w-full cursor-default bg-gray-100 px-2.5 py-1.5 whitespace-nowrap text-gray-400 lg:hidden"
          >
            작성 완료
          </Button>
        ) : (
          <Button
            size="sm"
            className="bg-primary w-full px-2.5 py-1.5 whitespace-nowrap lg:hidden"
            onClick={() => setIsReviewModalOpen(true)}
          >
            후기 작성
          </Button>
        ))}
    </div>
  );
}
