'use client';

import ChevronLeft from '@/assets/icon/ChevronLeft.svg';
import ChevronRight from '@/assets/icon/ChevronRight.svg';
import { cn } from '@/utils/cn';

import type { CalendarHeaderProps } from './types';

export const CalendarHeader = ({
  currentMonth,
  variant = 'default',
  onPrevMonth,
  onNextMonth,
  onMonthSelect,
  selectableMonths,
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

  const currentYear = currentMonth.getFullYear();
  const currentMonthNum = currentMonth.getMonth() + 1;

  const selectYears = selectableMonths
    ? [...new Set(selectableMonths.map((m) => parseInt(m.split('-')[0])))].sort((a, b) => a - b)
    : [];

  const selectMonths = selectableMonths
    ? selectableMonths
        .filter((m) => parseInt(m.split('-')[0]) === currentYear)
        .map((m) => parseInt(m.split('-')[1]))
        .sort((a, b) => a - b)
    : [];

  const handleYearChange = (year: number) => {
    const monthsForYear = selectableMonths!
      .filter((m) => parseInt(m.split('-')[0]) === year)
      .map((m) => parseInt(m.split('-')[1]))
      .sort((a, b) => a - b);
    const month = monthsForYear.includes(currentMonthNum) ? currentMonthNum : monthsForYear[0];
    onMonthSelect?.(new Date(year, month - 1, 1));
  };

  const handleMonthChange = (month: number) => {
    onMonthSelect?.(new Date(currentYear, month - 1, 1));
  };

  const selectClass =
    'text-base font-bold text-(--color-text-primary) md:text-xl cursor-pointer text-center bg-primary-100 rounded-sm';

  if (variant === 'secondary') {
    return (
      <div className={cn('mb-2', className)}>
        <em className={cn('mb-2.5 block text-sm font-bold not-italic', labelClassName)}> 날짜 </em>
        <div className={cn('flex items-center justify-between', contentClassName)}>
          {selectableMonths ? (
            <strong className={cn('flex items-center gap-1 font-medium', titleClassName)}>
              <select
                value={currentMonthNum}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className={cn(
                  selectClass,
                  'bg-transparent text-left text-base font-medium md:text-base'
                )}
                aria-label="월 선택"
              >
                {selectMonths.map((m) => (
                  <option key={m} value={m}>
                    {new Date(currentYear, m - 1, 1).toLocaleString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={currentYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className={cn(
                  selectClass,
                  'bg-transparent text-left text-base font-medium md:text-base'
                )}
                aria-label="년도 선택"
              >
                {selectYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </strong>
          ) : (
            <strong className={cn('font-medium', titleClassName)}>
              {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </strong>
          )}
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
      {selectableMonths ? (
        <strong
          className={cn(
            'flex items-center gap-0.5 text-base font-bold text-(--color-text-primary) md:text-xl',
            titleClassName
          )}
        >
          <select
            value={currentYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className={selectClass}
            aria-label="년도 선택"
          >
            {selectYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          년
          <select
            value={currentMonthNum}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className={cn(selectClass, 'ml-0.5')}
            aria-label="월 선택"
          >
            {selectMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          월
        </strong>
      ) : (
        <strong
          className={cn(
            'text-base font-bold text-(--color-text-primary) md:text-xl',
            titleClassName
          )}
        >
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </strong>
      )}
      {nextButton}
    </div>
  );
};
