'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';

import { CalendarHeader } from './CalendarHeader';
import type { CalendarDateInfo, CalendarProps } from './types';
import { getCalendarDates, toLocalDateString } from './utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar = ({
  value,
  defaultValue,
  defaultMonth = new Date(),
  onSelectDate,
  onMonthChange,
  selectableMonths,
  holidays = [],
  renderDateCell,
  renderDateExtra,
  isDateDisabled,
  isDateClickable,
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
  defaultClassName,
  pointClassName,
  isDatePoint,
}: CalendarProps) => {
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(defaultValue);

  const resolvedValue = value ?? internalSelectedDate;

  const [currentMonth, setCurrentMonth] = useState(() => {
    const initialDate = value ?? defaultValue;
    return initialDate
      ? new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
      : defaultMonth;
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const holidaySet = useMemo(() => new Set(holidays), [holidays]);

  const [prevValueKey, setPrevValueKey] = useState<string | undefined>(
    value ? `${value.getFullYear()}-${value.getMonth()}` : undefined
  );

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
  const valueString = resolvedValue?.toDateString();

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

  const handleMonthSelect = (date: Date) => {
    setCurrentMonth(date);
    onMonthChange?.(date);
  };

  return (
    <div className={className}>
      <CalendarHeader
        currentMonth={currentMonth}
        variant={headerVariant}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onMonthSelect={handleMonthSelect}
        selectableMonths={selectableMonths}
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
          const isNotClickable = isDateClickable ? !isDateClickable(date) : false;
          const hasPoint = isDatePoint?.(date) ?? false;

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                setInternalSelectedDate(date);
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
                isNotClickable && 'pointer-events-none cursor-default',
                dateClassName
              )}
            >
              {renderDateCell ? (
                renderDateCell(dateInfo)
              ) : (
                <span
                  className={cn(
                    'flex h-full w-full flex-col items-center font-medium',
                    dateCellClassName
                  )}
                >
                  {dateInfo.isSelected ? (
                    <span
                      className={cn(
                        'bg-primary mt-2.5 flex h-11.5 w-11.5 items-center justify-center rounded-full text-(--color-white) md:mt-4.5',
                        selectedClassName
                      )}
                    >
                      <span className={cn(hasPoint && pointClassName)}>{dateInfo.dateNumber}</span>
                    </span>
                  ) : dateInfo.isToday ? (
                    <span
                      className={cn(
                        'bg-primary-100 text-primary-500 mt-2.5 flex h-11.5 w-11.5 items-center justify-center rounded-full md:mt-4.5',
                        todayClassName
                      )}
                    >
                      <span className={cn(hasPoint && pointClassName)}>{dateInfo.dateNumber}</span>
                    </span>
                  ) : dateInfo.isHoliday || dateInfo.isSunday ? (
                    <span
                      className={cn(
                        'mt-2.5 flex h-11.5 w-11.5 items-center justify-center rounded-full text-red-500 md:mt-4.5',
                        holidayClassName
                      )}
                    >
                      <span className={cn(hasPoint && pointClassName)}>{dateInfo.dateNumber}</span>
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'mt-2.5 flex h-11.5 w-11.5 items-center justify-center rounded-full md:mt-4.5',
                        defaultClassName
                      )}
                    >
                      <span className={cn(hasPoint && pointClassName)}>{dateInfo.dateNumber}</span>
                    </span>
                  )}
                  {renderDateExtra?.(dateInfo)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
