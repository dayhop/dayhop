'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarStatusBadge } from '@/components/ui/CalendarStatusBadge';
import { useKoreanHolidays } from '@/hooks/useKoreanHolidays';
import {
  getMyActivityReservationDashboard,
  getMyActivityReservedSchedule,
} from '@/lib/api/my-activities';
import type {
  GetMyActivityReservationDashboardResponse,
  GetMyActivityReservedScheduleResponse,
  ReservationCount,
} from '@/lib/api/my-activities/type';
import { showToast } from '@/utils/toast';
import { Calendar } from '../Calendar/Calendar';
import type { CalendarDateInfo } from '../Calendar/types';
import { buildSelectableMonths, isPastTime, toLocalDateString } from '../Calendar/utils';
import { CalendarMyActivitiesModal } from '../CalendarMyActivitiesModal';

interface CalendarBoardProps {
  activityId: number;
  wrapperClassName?: string;
}

function buildDateDataMap(
  datesWithReservations: GetMyActivityReservationDashboardResponse[],
  datesNeedingSchedules: string[],
  scheduleResults: GetMyActivityReservedScheduleResponse[][]
): Map<string, ReservationCount> {
  const map = new Map<string, ReservationCount>();

  // completed 뱃지: 대시보드 값 직접 사용
  // (getMyActivityReservedSchedule은 완료된 슬롯을 반환하지 않으므로)
  datesWithReservations.forEach(({ date, reservations: r }) => {
    map.set(date, { pending: 0, confirmed: 0, completed: r.completed });
  });

  // pending/confirmed 뱃지: 시간이 지나지 않은 슬롯 수만 카운트
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

  return map;
}

const SELECTABLE_MONTHS = buildSelectableMonths();

export const CalendarBoard = ({ activityId, wrapperClassName }: CalendarBoardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
    };
  }, []);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateDataMap, setDateDataMap] = useState<Map<string, ReservationCount>>(new Map());
  const [refreshKey, setRefreshKey] = useState(0);
  const holidays = useKoreanHolidays(currentMonth.getFullYear(), currentMonth.getMonth());

  useEffect(() => {
    let ignore = false;

    async function fetchDashboard() {
      const dashboardRes = await getMyActivityReservationDashboard(activityId, {
        year: String(currentMonth.getFullYear()),
        month: String(currentMonth.getMonth() + 1).padStart(2, '0'),
      });
      if (ignore) return;
      if (!dashboardRes.success) {
        showToast.error(dashboardRes.message);
        return;
      }
      const dashboard = dashboardRes.data;

      const datesWithReservations = dashboard.filter(
        ({ reservations: r }) => r.pending > 0 || r.confirmed > 0 || r.completed > 0
      );

      // pending/confirmed가 있는 날짜만 스케줄 API 호출 (슬롯 수 카운트용)
      const datesNeedingSchedules = datesWithReservations
        .filter(({ reservations: r }) => r.pending > 0 || r.confirmed > 0)
        .map(({ date }) => date);

      const scheduleResults = await Promise.all(
        datesNeedingSchedules.map((date) => getMyActivityReservedSchedule(activityId, { date }))
      );
      if (ignore) return;
      const failedSchedule = scheduleResults.find((r) => !r.success);
      if (failedSchedule && !failedSchedule.success) {
        showToast.error(failedSchedule.message);
        return;
      }

      setDateDataMap(
        buildDateDataMap(
          datesWithReservations,
          datesNeedingSchedules,
          scheduleResults.flatMap((r) => (r.success ? [r.data] : []))
        )
      );
    }
    fetchDashboard();

    return () => {
      ignore = true;
    };
  }, [activityId, currentMonth, refreshKey]);

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
    setSelectedDate(undefined);
  };

  const handleDateSelect = (date: Date) => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSelectedDate(date);
    setTimeout(() => setIsModalOpen(true), 0);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setSelectedDate(undefined);
      closeTimerRef.current = null;
    }, 300);
  };

  const isDateClickable = useCallback(
    (date: Date) => dateDataMap.has(toLocalDateString(date)),
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
        onSelectDate={handleDateSelect}
        onMonthChange={handleMonthChange}
        selectableMonths={SELECTABLE_MONTHS}
        holidays={holidays}
        isDateClickable={isDateClickable}
        clickableDateClassName="hover:bg-(--color-bg-surface)"
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
      {selectedDate && (
        <CalendarMyActivitiesModal
          isOpen={isModalOpen}
          activityId={activityId}
          date={toLocalDateString(selectedDate)}
          onClose={handleModalClose}
          onReservationChange={() => setRefreshKey((k) => k + 1)}
          className="flex max-h-[70vh] w-full flex-col rounded-t-[30px] px-0 py-7.5 shadow-[0_4px_24px_0_rgba(156,180,202,0.20)] lg:pointer-events-auto lg:max-w-85"
          overlayClassName="items-end lg:absolute lg:bg-transparent lg:pointer-events-none lg:inset-auto lg:right-[27px] lg:bottom-[-13px] z-49"
        />
      )}
    </>
  );
};
