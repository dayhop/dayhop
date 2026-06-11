import { ReservationStatus } from '@/types/api';

interface ReservationStateBadgeProps {
  reservationState: ReservationStatus;
}
const RESERVATION_MAP: Record<ReservationStatus, { text: string; className: string }> = {
  pending: {
    text: '예약 완료',
    className: 'text-status-pending-text bg-status-pending-bg',
  },
  canceled: {
    text: '예약 취소',
    className: 'text-status-canceled-text bg-status-canceled-bg',
  },
  declined: {
    text: '예약 거절',
    className: 'text-status-declined-text bg-status-declined-bg',
  },
  completed: {
    text: '체험 완료',
    className: 'text-status-completed-text bg-status-completed-bg',
  },
  confirmed: {
    text: '예약 승인',
    className: 'text-status-confirmed-text bg-status-confirmed-bg',
  },
};

export function ReservationStateBadge({ reservationState }: ReservationStateBadgeProps) {
  return (
    <div
      className={`${RESERVATION_MAP[reservationState].className} inline-flex w-fit items-center justify-center rounded-full px-2 py-1 text-[13px] font-bold`}
    >
      {RESERVATION_MAP[reservationState].text}
    </div>
  );
}
