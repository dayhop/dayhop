//========================== 삭제 =================================
type ReservationState = 'confirmed' | 'cancelled' | 'rejected' | 'completed';

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

//====================================================================
interface ReservationCardProps {
  title: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: ReservationState;
  headCount: number;
}
export function ReservationCard({
  title,
  startTime,
  endTime,
  totalPrice,
  status,
  headCount,
}: ReservationCardProps) {
  return (
    <div className="flex h-37 w-fit flex-col justify-end gap-2 rounded-3xl p-5 text-sm shadow-[0_-8px_20px_0_rgba(0,0,0,0.05)]">
      <div>
        <ReservationStateBadge reservationState={status} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-bold">{title}</div>
        <div className="text-[13px] text-gray-500">
          {startTime} ~ {endTime}
        </div>
      </div>
      <div className="flex gap-1">
        <div className="text-[16px] font-bold">{totalPrice}원</div>
        <div className="text-gray-400">{headCount}명</div>
      </div>
    </div>
  );
}
