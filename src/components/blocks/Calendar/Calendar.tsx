'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import ChevronLeft from '@/assets/icon/ChevronLeft.svg';
import ChevronRight from '@/assets/icon/ChevronRight.svg';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type CalendarDateInfo = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isHoliday: boolean;
};

type CalendarProps = {
  value?: Date;
  defaultMonth?: Date;
  onSelectDate?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  holidays?: string[];
  renderDateCell?: (dateInfo: CalendarDateInfo) => React.ReactNode;
  headerVariant?: CalendarHeaderVariant;
  dayClassName?: string;
};

const getCalendarDates = (year: number, month: number) => {
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  const firstDay = firstDate.getDay();
  const lastDay = lastDate.getDay();

  const startDate = new Date(year, month, 1 - firstDay);
  const endDate = new Date(year, month, lastDate.getDate() + (6 - lastDay));

  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDate = diffTime / (1000 * 60 * 60 * 24);

  return Array.from({ length: diffDate + 1 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
};

type CalendarHeaderVariant = 'default' | 'secondary';

type CalendarHeaderProps = {
  currentMonth: Date;
  variant?: CalendarHeaderVariant;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
  titleClassName?: string;
  labelClassName?: string;
  navigationClassName?: string;
};

const CalendarHeader = ({
  currentMonth,
  variant = 'default',
  onPrevMonth,
  onNextMonth,
  className,
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
      <div className={className}>
        <em className={cn('mb-3 block text-sm font-bold', labelClassName)}> 날짜 </em>
        <div className="flex items-center justify-between">
          <strong className={titleClassName}>
            {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </strong>
          <div className={cn('flex items-center gap-4', navigationClassName)}>
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
        {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
      </strong>
      {nextButton}
    </div>
  );
};

export const Calendar = ({
  value,
  defaultMonth = new Date(),
  onSelectDate,
  onMonthChange,
  holidays = [],
  renderDateCell,
  headerVariant = 'default',
  dayClassName,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const dates = getCalendarDates(year, month);

  const handlePrevMonth = () => {
    const prevMonth = new Date(year, month - 1, 1);

    setCurrentMonth(prevMonth);
    onMonthChange?.(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(year, month + 1, 1);

    setCurrentMonth(nextMonth);
    onMonthChange?.(nextMonth);
  };

  return (
    <div>
      <CalendarHeader
        currentMonth={currentMonth}
        variant={headerVariant}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <div className="grid grid-cols-7">
        {DAYS.map((day, index) => (
          <div
            key={index}
            className={cn('flex min-h-10 items-center justify-center', dayClassName)}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {dates.map((date) => {
          const dateInfo: CalendarDateInfo = {
            date,
            day: date.getDate(),
            isCurrentMonth: date.getMonth() === month,
            isToday: date.toDateString() === new Date().toDateString(),
            isSelected: value?.toDateString() === date.toDateString(),
            isHoliday: holidays.includes(date.toISOString().slice(0, 10)),
          };

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelectDate?.(date)}
              className={cn(!dateInfo.isCurrentMonth && 'text-gray-300')}
            >
              {renderDateCell ? renderDateCell(dateInfo) : dateInfo.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
