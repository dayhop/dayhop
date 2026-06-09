'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import ChevronLeft from '@/assets/icon/ChevronLeft.svg';
import ChevronRight from '@/assets/icon/ChevronRight.svg';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type CalendarHeaderVariant = 'default' | 'secondary';

type CalendarDateInfo = {
  date: Date;
  dateNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isHoliday: boolean;
  isSunday: boolean;
};

type CalendarProps = {
  value?: Date;
  defaultMonth?: Date;
  onSelectDate?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  holidays?: string[];
  renderDateCell?: (dateInfo: CalendarDateInfo) => React.ReactNode;
  isDateDisabled?: (date: Date) => boolean;
  headerVariant?: CalendarHeaderVariant;
  className?: string;
  headerClassName?: string;
  headerContentClassName?: string;
  headerTitleClassName?: string;
  headerLabelClassName?: string;
  headerNavigationClassName?: string;
  dayHeaderClassName?: string;
  dayClassName?: string;
  dateClassName?: string;
  dateCellClassName?: string;
  todayClassName?: string;
  selectedClassName?: string;
  holidayClassName?: string;
};

const toLocalDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getCalendarDates = (year: number, month: number) => {
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  const firstDay = firstDate.getDay();
  const lastDay = lastDate.getDay();

  const startDate = new Date(year, month, 1 - firstDay);
  const totalDays = firstDay + lastDate.getDate() + (6 - lastDay);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
};

type CalendarHeaderProps = {
  currentMonth: Date;
  variant?: CalendarHeaderVariant;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
  contentClassName?: string;
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
            {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
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
  isDateDisabled,
  headerVariant = 'default',
  className,
  headerClassName,
  headerContentClassName,
  headerTitleClassName,
  headerLabelClassName,
  headerNavigationClassName,
  dayHeaderClassName,
  dayClassName,
  dateClassName,
  dateCellClassName,
  todayClassName,
  selectedClassName,
  holidayClassName,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(() =>
    value ? new Date(value.getFullYear(), value.getMonth(), 1) : defaultMonth
  );

  const [prevValueKey, setPrevValueKey] = useState<string | undefined>(
    value ? `${value.getFullYear()}-${value.getMonth()}` : undefined
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const holidaySet = useMemo(() => new Set(holidays), [holidays]);

  const valueKey = value ? `${value.getFullYear()}-${value.getMonth()}` : undefined;
  const currentMonthKey = `${year}-${month}`;

  if (valueKey !== prevValueKey) {
    setPrevValueKey(valueKey);

    if (valueKey && valueKey !== currentMonthKey && value) {
      setCurrentMonth(new Date(value.getFullYear(), value.getMonth(), 1));
    }
  }
  const dates = getCalendarDates(year, month);
  const todayString = new Date().toDateString();
  const valueString = value?.toDateString();

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
    <div className={className}>
      <CalendarHeader
        currentMonth={currentMonth}
        variant={headerVariant}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        className={headerClassName}
        contentClassName={headerContentClassName}
        titleClassName={headerTitleClassName}
        labelClassName={headerLabelClassName}
        navigationClassName={headerNavigationClassName}
      />

      <div className={cn('grid grid-cols-7 pb-1 md:pb-3', dayHeaderClassName)}>
        {DAYS.map((day, index) => (
          <div
            key={index}
            className={cn(
              'flex min-h-10 items-center justify-center text-[13px] font-bold text-(--color-calendar-secondary) md:min-h-10.75 md:text-base',
              dayClassName
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid h-130 auto-rows-fr grid-cols-7 md:h-155">
        {dates.map((date) => {
          const dateInfo: CalendarDateInfo = {
            date,
            dateNumber: date.getDate(),
            isCurrentMonth: date.getMonth() === month,
            isToday: date.toDateString() === todayString,
            isSelected: valueString === date.toDateString(),
            isHoliday: holidaySet.has(toLocalDateString(date)),
            isSunday: date.getDay() === 0,
          };
          const isDisabled = isDateDisabled?.(date) ?? false;

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                onSelectDate?.(date);
                if (!dateInfo.isCurrentMonth) {
                  const newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                  setCurrentMonth(newMonth);
                  onMonthChange?.(newMonth);
                }
              }}
              aria-label={date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              aria-pressed={dateInfo.isSelected}
              aria-disabled={isDisabled}
              className={cn(
                'flex h-full w-full cursor-pointer justify-center text-[12px] font-medium text-(--color-calendar-primary) md:text-base',
                isDisabled && 'cursor-not-allowed opacity-40',
                !dateInfo.isCurrentMonth && 'opacity-40',
                dateClassName
              )}
            >
              {renderDateCell ? (
                renderDateCell(dateInfo)
              ) : (
                <span
                  className={cn('flex h-full w-full justify-center font-medium', dateCellClassName)}
                >
                  {dateInfo.isSelected ? (
                    <span
                      className={cn(
                        'bg-primary mt-2.5 flex h-11.5 w-11.5 items-center justify-center rounded-full text-(--color-white) md:mt-4.5',
                        selectedClassName
                      )}
                    >
                      <span>{dateInfo.dateNumber}</span>
                    </span>
                  ) : dateInfo.isToday ? (
                    <span
                      className={cn(
                        'bg-primary-100 text-primary-500 mt-2.5 flex h-11.5 w-11.5 items-center justify-center rounded-full md:mt-4.5',
                        todayClassName
                      )}
                    >
                      <span>{dateInfo.dateNumber}</span>
                    </span>
                  ) : dateInfo.isHoliday || dateInfo.isSunday ? (
                    <span
                      className={cn(
                        'mt-2.5 flex h-11.5 w-11.5 items-center justify-center rounded-full text-red-500 md:mt-4.5',
                        holidayClassName
                      )}
                    >
                      <span>{dateInfo.dateNumber}</span>
                    </span>
                  ) : (
                    <span className="mt-2.5 flex h-11.5 w-11.5 items-center justify-center rounded-full md:mt-4.5">
                      <span>{dateInfo.dateNumber}</span>
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
