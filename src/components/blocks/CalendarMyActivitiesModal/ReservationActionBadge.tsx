type ActionStatus = 'approve' | 'decline';

interface ReservationActionBadgeProps {
  action: ActionStatus;
  onClick?: () => void;
}

const ACTION_CONFIG = {
  approve: {
    label: '승인하기',
    className: 'text-gray-600 bg-bg border-gray-50 border',
  },
  decline: {
    label: '거절하기',
    className: 'text-status-canceled-text bg-status-canceled-bg',
  },
} as const;

export const ReservationActionBadge = ({ action, onClick }: ReservationActionBadgeProps) => {
  const { label, className } = ACTION_CONFIG[action];

  return (
    <button
      className={`h-7.5 cursor-pointer rounded-lg px-2.5 text-sm font-medium ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
