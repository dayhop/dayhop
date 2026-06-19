import { useCallback, useEffect, useRef, useState } from 'react';
import { showToast } from '@/utils/toast';
import { isPastTime } from '../Calendar/utils';
import { getMyActivityReservedSchedule, getMyActivityReservations } from '@/lib/api/my-activities';
import type {
  GetMyActivityReservedScheduleResponse,
  MyActivityReservation,
} from '@/lib/api/my-activities/type';

export type TabStatus = 'pending' | 'confirmed' | 'declined';

function formatTimeOption(schedule: GetMyActivityReservedScheduleResponse) {
  return `${schedule.startTime} - ${schedule.endTime}`;
}

interface UseReservationModalParams {
  activityId: number;
  date: string;
  onReservationChange?: () => void;
}

export function useReservationModal({
  activityId,
  date,
  onReservationChange,
}: UseReservationModalParams) {
  const [activeTab, setActiveTab] = useState<TabStatus>('pending');
  const [schedules, setSchedules] = useState<GetMyActivityReservedScheduleResponse[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reservations, setReservations] = useState<MyActivityReservation[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const isFetchingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedSchedule = schedules.find((s) => formatTimeOption(s) === selectedTime);
  const selectedScheduleId = selectedSchedule?.scheduleId;
  const isSchedulePast = selectedSchedule ? isPastTime(date, selectedSchedule.endTime) : false;

  useEffect(() => {
    let ignore = false;
    async function loadSchedules() {
      try {
        const data = await getMyActivityReservedSchedule(activityId, { date });
        if (ignore) return;
        setSchedules(data);
        setSelectedTime(data.length > 0 ? formatTimeOption(data[0]) : '');
      } catch {
        if (!ignore) {
          setSchedules([]);
          setSelectedTime('');
          showToast.error('스케줄을 불러오는 데 실패했습니다.');
        }
      }
    }
    loadSchedules();
    return () => {
      ignore = true;
    };
  }, [activityId, date]);

  useEffect(() => {
    if (refreshTrigger === 0) return;
    let ignore = false;
    async function refreshScheduleCounts() {
      try {
        const data = await getMyActivityReservedSchedule(activityId, { date });
        if (ignore) return;
        setSchedules((prev) =>
          prev.map((prevSlot) => data.find((s) => s.scheduleId === prevSlot.scheduleId) ?? prevSlot)
        );
      } catch {
        if (!ignore) showToast.error('스케줄 정보를 갱신하는 데 실패했습니다.');
      }
    }
    refreshScheduleCounts();
    return () => {
      ignore = true;
    };
  }, [activityId, date, refreshTrigger]);

  useEffect(() => {
    let ignore = false;
    async function loadReservations() {
      if (selectedScheduleId === undefined) {
        setReservations([]);
        setCursorId(null);
        return;
      }
      try {
        const data = await getMyActivityReservations(activityId, {
          scheduleId: selectedScheduleId,
          status: activeTab,
        });
        if (ignore) return;
        setReservations(data.reservations);
        setCursorId(data.cursorId);
      } catch {
        if (!ignore) {
          setReservations([]);
          setCursorId(null);
          showToast.error('예약 목록을 불러오는 데 실패했습니다.');
        }
      }
    }
    loadReservations();
    return () => {
      ignore = true;
    };
  }, [activityId, selectedScheduleId, activeTab, refreshTrigger]);

  const loadMore = useCallback(async () => {
    if (isFetchingMoreRef.current || cursorId === null || selectedScheduleId === undefined) return;
    isFetchingMoreRef.current = true;
    try {
      const data = await getMyActivityReservations(activityId, {
        scheduleId: selectedScheduleId,
        status: activeTab,
        cursorId,
      });
      setReservations((prev) => [...prev, ...data.reservations]);
      setCursorId(data.cursorId);
    } catch {
      showToast.error('예약 목록을 불러오는 데 실패했습니다.');
    } finally {
      isFetchingMoreRef.current = false;
    }
  }, [cursorId, selectedScheduleId, activityId, activeTab]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: scrollContainerRef.current, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const refreshAfterAction = () => {
    setRefreshTrigger((prev) => prev + 1);
    onReservationChange?.();
  };

  return {
    activeTab,
    setActiveTab,
    schedules,
    selectedTime,
    setSelectedTime,
    selectedSchedule,
    selectedScheduleId,
    isSchedulePast,
    reservations,
    cursorId,
    sentinelRef,
    scrollContainerRef,
    refreshAfterAction,
  };
}
