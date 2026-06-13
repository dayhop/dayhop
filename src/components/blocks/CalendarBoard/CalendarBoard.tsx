'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar } from '../Calendar/Calendar';
import { getMyActivities, getMyActivityReservationDashboard } from '@/lib/api/my-activities';
import type { ReservationCount } from '@/lib/api/my-activities/type';
import { toLocalDateString } from '../Calendar/utils';

export const CalendarBoard = () => {
  const [activityId, setActivityId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateDataMap, setDateDataMap] = useState<Map<string, ReservationCount>>(new Map());

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

    async function fetchDashboard() {
      try {
        const data = await getMyActivityReservationDashboard(activityId!, {
          year: String(currentMonth.getFullYear()),
          month: String(currentMonth.getMonth() + 1).padStart(2, '0'),
        });
        const map = new Map<string, ReservationCount>();
        data.forEach(({ date, reservations: r }) => {
          if (r.pending > 0 || r.confirmed > 0 || r.completed > 0) {
            map.set(date, r);
          }
        });
        setDateDataMap(map);
      } catch {
        //글로벌 인터셉터에서 처리
      }
    }
    fetchDashboard();
  }, [activityId, currentMonth]);

  const isDateClickable = useMemo(
    () => (date: Date) => dateDataMap.has(toLocalDateString(date)),
    [dateDataMap]
  );

  return (
    <Calendar
      value={selectedDate}
      onSelectDate={setSelectedDate}
      onMonthChange={setCurrentMonth}
      isDateClickable={isDateClickable}
      dayHeaderClassName="border-b border-border-default"
      dateClassName="border-b border-gray-50 [&:nth-last-child(-n+7)]:border-b-0"
      selectedClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
      todayClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
      holidayClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
      defaultClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
    />
  );
};
