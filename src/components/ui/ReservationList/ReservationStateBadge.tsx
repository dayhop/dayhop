type ReservationState = 'confirmed' | 'cancelled' | 'rejected' | 'completed';
type Color = 'red' | 'green' | 'blue' | 'gray';

interface ReservationStateBadgeProps {
  reservationState: ReservationState;
}

export function ReservationStateBadge({ reservationState }: ReservationStateBadgeProps) {
  const RESERVATION_MAP: Record<ReservationState, { text: string; className: string }> = {
    confirmed: {
      text: '예약 완료',
      className: 'text-blue-700 bg-blue-50',
    },
    cancelled: {
      text: '예약 취소',
      className: 'text-gray-600 bg-gray-100',
    },
    rejected: {
      text: '예약 거절',
      className: 'text-red-700 bg-red-50',
    },
    completed: {
      text: '체험 완료',
      className: 'text-green-700 bg-green-50',
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
