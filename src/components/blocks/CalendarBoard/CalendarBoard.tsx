'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarStatusBadge } from '@/components/ui/CalendarStatusBadge';
import { getMyActivities, getMyActivityReservationDashboard } from '@/lib/api/my-activities';
import type { ReservationCount } from '@/lib/api/my-activities/type';
import { Calendar } from '../Calendar/Calendar';
import type { CalendarDateInfo } from '../Calendar/types';
import { toLocalDateString } from '../Calendar/utils';
import { CalendarMyActivitiesModal } from '../CalendarMyActivitiesModal';

interface CalendarBoardProps {
  wrapperClassName?: string;
}

export const CalendarBoard = ({ wrapperClassName }: CalendarBoardProps) => {
  const [activityId, setActivityId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateDataMap, setDateDataMap] = useState<Map<string, ReservationCount>>(new Map());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await getMyActivities();
        if (data.activities.length > 0) {
          setActivityId(data.activities[0].id);
        }
      } catch {
        // 글로벌 인터셉터에서 처리
      }
    }
    fetchActivities();
  }, []);

  useEffect(() => {
    if (activityId === null) return;

    let ignore = false;

    async function fetchDashboard() {
      try {
        const data = await getMyActivityReservationDashboard(activityId!, {
          year: String(currentMonth.getFullYear()),
          month: String(currentMonth.getMonth() + 1).padStart(2, '0'),
        });
        if (ignore) return;
        const map = new Map<string, ReservationCount>();
        data.forEach(({ date, reservations: r }) => {
          if (r.pending > 0 || r.confirmed > 0 || r.completed > 0) {
            map.set(date, r);
          }
        });
        setDateDataMap(map);
      } catch {
        // 글로벌 인터셉터에서 처리
      }
    }
    fetchDashboard();

    return () => {
      ignore = true;
    };
  }, [activityId, currentMonth, refreshKey]);

  const isDateClickable = useMemo(
    () => (date: Date) => dateDataMap.has(toLocalDateString(date)),
    [dateDataMap]
  );

  const renderDateExtra = useCallback(
    (dateInfo: CalendarDateInfo) => {
      const data = dateDataMap.get(toLocalDateString(dateInfo.date));
      if (!data) return null;
      return (
        <div className="mt-1 flex w-full max-w-11.5 flex-col items-center gap-1.25 md:max-w-17">
          {data.pending > 0 && <CalendarStatusBadge status="pending" count={data.pending} />}
          {data.confirmed > 0 && <CalendarStatusBadge status="confirmed" count={data.confirmed} />}
          {data.completed > 0 && <CalendarStatusBadge status="completed" count={data.completed} />}
        </div>
      );
    },
    [dateDataMap]
  );

  return (
    <>
      <Calendar
        value={selectedDate}
        onSelectDate={setSelectedDate}
        onMonthChange={setCurrentMonth}
        isDateClickable={isDateClickable}
        renderDateExtra={renderDateExtra}
        isDatePoint={isDateClickable}
        className={wrapperClassName}
        pointClassName="relative before:absolute before:top-[-2px] before:right-[-4px] before:h-1 before:w-1 before:rounded-full before:bg-[#FF2727] before:content-[''] md:before:top-[-5px] md:before:right-[-13px] md:before:h-[6px] md:before:w-[6px]"
        dayHeaderClassName="border-b border-border-default"
        dateClassName="border-b border-gray-50 [&:nth-last-child(-n+7)]:border-b-0"
        selectedClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
        todayClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
        holidayClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
        defaultClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
      />
      {selectedDate && activityId !== null && (
        <CalendarMyActivitiesModal
          activityId={activityId}
          date={toLocalDateString(selectedDate)}
          onClose={() => setSelectedDate(undefined)}
          onReservationChange={() => setRefreshKey((k) => k + 1)}
          className="flex max-h-[70vh] w-full flex-col rounded-t-[30px] px-0 py-7.5 shadow-[0_4px_24px_0_rgba(156,180,202,0.20)] lg:pointer-events-auto lg:max-w-85"
          overlayClassName="items-end lg:absolute lg:bg-transparent lg:pointer-events-none lg:inset-auto lg:right-[27px] lg:bottom-[-13px] z-49"
        />
      )}
    </>
  );
};
