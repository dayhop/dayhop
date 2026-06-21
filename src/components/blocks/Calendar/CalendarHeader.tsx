'use client';

import ChevronLeft from '@/assets/icon/ChevronLeft.svg';
import ChevronRight from '@/assets/icon/ChevronRight.svg';
import { cn } from '@/utils/cn';

import type { CalendarHeaderProps } from './types';

export const CalendarHeader = ({
  currentMonth,
  title,
  variant = 'default',
  onPrevMonth,
  onNextMonth,
  className,
  contentClassName,
  titleClassName,
  labelClassName,
  navigationClassName,
}: CalendarHeaderProps) => {
  const prevButton = (
    <button
      type="button"
      onClick={onPrevMonth}
      aria-label="이전 달"
      className="h-5 w-5 cursor-pointer md:h-6 md:w-6"
    >
      <ChevronLeft />
    </button>
  );

  const nextButton = (
    <button
      type="button"
      onClick={onNextMonth}
      aria-label="다음 달"
      className="h-5 w-5 cursor-pointer md:h-6 md:w-6"
    >
      <ChevronRight />
    </button>
  );

  if (variant === 'secondary') {
    return (
      <div className={cn('mb-2', className)}>
        <em className={cn('mb-2.5 block text-sm font-bold not-italic', labelClassName)}> 날짜 </em>
        <div className={cn('flex items-center justify-between', contentClassName)}>
          <strong className={cn('font-medium', titleClassName)}>
            {title ?? currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </strong>
          <div className={cn('flex items-center gap-3', navigationClassName)}>
            {prevButton} {nextButton}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('mb-5 flex items-center justify-center gap-2.5 md:mb-10 md:gap-7.5', className)}
    >
      {prevButton}
      <strong
        className={cn('text-base font-bold text-(--color-text-primary) md:text-xl', titleClassName)}
      >
        {title ?? `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`}
      </strong>
      {nextButton}
    </div>
  );
};
