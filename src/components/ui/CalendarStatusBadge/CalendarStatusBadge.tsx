import { cn } from '@/utils/cn';

type CalendarStatus = 'completed' | 'pending' | 'confirmed';

interface CalendarStatusBadgeProps {
  status: CalendarStatus;
  count: number;
  className?: string;
}

const STATUS_CONFIG = {
  completed: {
    label: '완료',
    className: 'bg-calendar-status-completed-bg text-calendar-status-completed-text',
  },
  pending: {
    label: '예약',
    className: 'bg-calendar-status-pending-bg text-calendar-status-pending-text',
  },
  confirmed: {
    label: '승인',
    className: 'bg-calendar-status-confirmed-bg text-calendar-status-confirmed-text',
  },
} as const;

export const CalendarStatusBadge = ({ status, count, className }: CalendarStatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex h-4 w-full items-center justify-center gap-0.75 rounded-sm p-0 text-[10px] font-medium md:h-5.25 md:gap-0.5 md:text-[14px]',
        config.className,
        className
      )}
    >
      <span>{config.label}</span>
      <span>{count}</span>
    </span>
  );
};
