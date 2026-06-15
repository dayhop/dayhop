import type { PatchMyActivityReservationStatusRequest } from '@/lib/api/my-activities/type';

type ActionStatus = PatchMyActivityReservationStatusRequest['status'];

interface ReservationActionBadgeProps {
  action: ActionStatus;
  onClick?: () => void;
}

const ACTION_CONFIG: Record<ActionStatus, { label: string; className: string }> = {
  confirmed: {
    label: '승인하기',
    className: 'text-gray-600 bg-bg border-gray-50 border',
  },
  declined: {
    label: '거절하기',
    className: 'text-status-canceled-text bg-status-canceled-bg',
  },
};

export const ReservationActionBadge = ({ action, onClick }: ReservationActionBadgeProps) => {
  const { label, className } = ACTION_CONFIG[action];

  return (
    <button
      type="button"
      className={`h-7.5 cursor-pointer rounded-lg px-2.5 text-sm font-medium ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
