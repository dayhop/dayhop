'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarStatusBadge } from '@/components/ui/CalendarStatusBadge';
import { useKoreanHolidays } from '@/hooks/useKoreanHolidays';
import {
  getMyActivityReservationDashboard,
  getMyActivityReservedSchedule,
} from '@/lib/api/my-activities';
import type {
  GetMyActivityReservedScheduleResponse,
  ReservationCount,
} from '@/lib/api/my-activities/type';
import { Calendar } from '../Calendar/Calendar';
import type { CalendarDateInfo } from '../Calendar/types';
import { isPastTime, toLocalDateString } from '../Calendar/utils';
import { CalendarMyActivitiesModal } from '../CalendarMyActivitiesModal';

interface CalendarBoardProps {
  activityId: number;
  wrapperClassName?: string;
}

export const CalendarBoard = ({ activityId, wrapperClassName }: CalendarBoardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateDataMap, setDateDataMap] = useState<Map<string, ReservationCount>>(new Map());
  const [refreshKey, setRefreshKey] = useState(0);
  const [schedulesCache, setSchedulesCache] = useState<
    Map<string, GetMyActivityReservedScheduleResponse[]>
  >(new Map());
  const holidays = useKoreanHolidays(currentMonth.getFullYear(), currentMonth.getMonth());

  useEffect(() => {
    let ignore = false;

    async function fetchDashboard() {
      try {
        const dashboard = await getMyActivityReservationDashboard(activityId, {
          year: String(currentMonth.getFullYear()),
          month: String(currentMonth.getMonth() + 1).padStart(2, '0'),
        });
        if (ignore) return;

        // 날짜별 completed 슬롯 수는 대시보드에서 직접 사용
        // (getMyActivityReservedSchedule은 완료된 슬롯을 반환하지 않으므로)
        const datesWithReservations = dashboard.filter(
          ({ reservations: r }) => r.pending > 0 || r.confirmed > 0 || r.completed > 0
        );

        // pending/confirmed가 있는 날짜만 스케줄 API 호출
        const datesNeedingSchedules = datesWithReservations
          .filter(({ reservations: r }) => r.pending > 0 || r.confirmed > 0)
          .map(({ date }) => date);

        const scheduleResults = await Promise.all(
          datesNeedingSchedules.map((date) => getMyActivityReservedSchedule(activityId, { date }))
        );
        if (ignore) return;

        // 스케줄 데이터 캐시 (모달에 전달해 셀렉트박스 복원에 사용)
        const newEntries = new Map<string, GetMyActivityReservedScheduleResponse[]>();
        datesNeedingSchedules.forEach((date, i) => {
          newEntries.set(date, scheduleResults[i]);
        });
        setSchedulesCache((prev) => new Map([...prev, ...newEntries]));

        const map = new Map<string, ReservationCount>();

        // completed 뱃지: 대시보드 값 직접 사용 (1슬롯당 1확정 예약 규칙으로 헤드카운트 = 슬롯 수)
        datesWithReservations.forEach(({ date, reservations: r }) => {
          map.set(date, { pending: 0, confirmed: 0, completed: r.completed });
        });

        // pending/confirmed 뱃지: 스케줄 API로 슬롯 수 계산
        datesNeedingSchedules.forEach((date, i) => {
          const slots = scheduleResults[i];
          const counts = map.get(date)!;
          slots.forEach((slot) => {
            const isPast = isPastTime(date, slot.endTime);
            if (!isPast && slot.count.pending > 0) counts.pending += 1;
            if (!isPast && slot.count.confirmed > 0) counts.confirmed += 1;
          });
        });

        // 모든 카운트가 0인 날짜 제거
        map.forEach((counts, date) => {
          if (counts.pending === 0 && counts.confirmed === 0 && counts.completed === 0) {
            map.delete(date);
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
        onMonthChange={(month) => {
          setCurrentMonth(month);
          setSelectedDate(undefined);
        }}
        holidays={holidays}
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
          cachedSchedules={schedulesCache.get(toLocalDateString(selectedDate)) ?? []}
          className="flex max-h-[70vh] w-full flex-col rounded-t-[30px] px-0 py-7.5 shadow-[0_4px_24px_0_rgba(156,180,202,0.20)] lg:pointer-events-auto lg:max-w-85"
          overlayClassName="items-end lg:absolute lg:bg-transparent lg:pointer-events-none lg:inset-auto lg:right-[27px] lg:bottom-[-13px] z-49"
        />
      )}
    </>
  );
};
