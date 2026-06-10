import type { ReservationStatus } from '@/lib/api/my-activities/type';

type BadgeStatus = Extract<ReservationStatus, 'confirmed' | 'declined'>;

interface ReservationResultBadgeProps {
  status: BadgeStatus;
}

const BADGE_CONFIG = {
  confirmed: {
    label: '예약 승인',
    className: 'bg-status-confirmed-bg text-status-confirmed-text',
  },
  declined: {
    label: '예약 거절',
    className: 'bg-status-declined-bg text-status-declined-text',
  },
} as const;

export const ReservationResultBadge = ({ status }: ReservationResultBadgeProps) => {
  const { label, className } = BADGE_CONFIG[status];

  return (
    <span className={`rounded-full px-2 py-1 text-[13px] font-bold ${className}`}>{label}</span>
  );
};
