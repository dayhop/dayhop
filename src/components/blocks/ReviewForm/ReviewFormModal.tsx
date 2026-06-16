'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { StarRating } from '@/components/ui/StarRating';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import IconClose from '@/assets/icon/icon-close.svg';
import { postMyReservationReview } from '@/lib/api/my-reservations';
import type { Reservation } from '@/lib/api/my-reservations/type';
import { showToast } from '@/utils/toast';

export interface ReviewFormModalProps {
  reservation: Pick<
    Reservation,
    'id' | 'activity' | 'date' | 'startTime' | 'endTime' | 'headCount'
  >;
  onClose: () => void;
}

export const ReviewFormModal = ({ reservation, onClose }: ReviewFormModalProps) => {
  const { activity, date, startTime, endTime, headCount } = reservation;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = rating > 0 && content.trim().length > 0;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await postMyReservationReview({ reservationId: reservation.id }, { rating, content });
      showToast.success('후기가 등록되었습니다.');
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      ariaLabel="후기 작성"
      className="relative w-[335px] max-w-[calc(100vw-32px)] md:w-[400px]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-6 right-6 cursor-pointer"
      >
        <IconClose className="h-6 w-6" />
      </button>

      <div className="flex flex-col items-center gap-1 pt-2 text-center">
        <h2 className="text-text-primary text-lg font-bold">{activity.title}</h2>
        <p className="text-text-tertiary text-sm">
          {date} / {startTime} - {endTime} ({headCount}명)
        </p>
      </div>

      <div className="mt-5 flex justify-center">
        <StarRating mode="interactive" rating={rating} onChange={setRating} />
      </div>

      <div className="mt-6">
        <Textarea
          variant="review"
          label="소중한 경험을 들려주세요"
          placeholder="체험에서 느낀 경험을 자유롭게 남겨주세요"
          maxLength={100}
          showCount
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <Button
        variant="primary"
        size="lg"
        className="mt-6"
        disabled={!isValid || isSubmitting}
        onClick={handleSubmit}
      >
        작성하기
      </Button>
    </Modal>
  );
};
