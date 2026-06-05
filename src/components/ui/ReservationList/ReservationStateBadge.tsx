type ReservationState = 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';

interface ReservationStateBadgeProps {
  reservationState: ReservationState;
}

export function ReservationStateBadge({ reservationState }: ReservationStateBadgeProps) {
  const RESERVATION_MAP: Record<ReservationState, { text: string; className: string }> = {
    pending: {
      text: '예약 완료',
      className: 'text-[#2BA90D] bg-[#E9FBE4]',
    },
    canceled: {
      text: '예약 취소',
      className: 'text-gray-600 bg-gray-100',
    },
    declined: {
      text: '예약 거절',
      className: 'text-[#F96767] bg-[#FCECEA]',
    },
    completed: {
      text: '체험 완료',
      className: 'text-[#0D6CD1] bg-[#DAF0FF]',
    },
    confirmed: {
      text: '예약 승인',
      className: 'text-[#1790A0] bg-[#DDF9F9]',
    },
  };

  return (
    <div
      className={`${RESERVATION_MAP[reservationState].className} inline-flex w-fit items-center justify-center rounded-full px-2 py-1 text-[13px] font-bold`}
    >
      {RESERVATION_MAP[reservationState].text}
    </div>
  );
}
