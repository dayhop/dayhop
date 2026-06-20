import { useCallback, useEffect, useRef, useState } from 'react';
import { showToast } from '@/utils/toast';
import { isPastTime } from '../Calendar/utils';
import { getMyActivityReservedSchedule, getMyActivityReservations } from '@/lib/api/my-activities';
import type {
  GetMyActivityReservationsParams,
  GetMyActivityReservedScheduleResponse,
  MyActivityReservation,
} from '@/lib/api/my-activities/type';

export type TabStatus = GetMyActivityReservationsParams['status'];

export function formatTimeOption(schedule: GetMyActivityReservedScheduleResponse) {
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentParamsRef = useRef({
    activeTab,
    selectedScheduleId: undefined as number | undefined,
  });

  const selectedSchedule = schedules.find((s) => formatTimeOption(s) === selectedTime);
  const selectedScheduleId = selectedSchedule?.scheduleId;
  const isSchedulePast = selectedSchedule ? isPastTime(date, selectedSchedule.endTime) : false;

  // 탭 또는 스케줄이 변경될 때 렌더링 중 즉시 초기화하여 stale cursorId로 loadMore가 호출되는 것을 방지
  const [prevActiveTab, setPrevActiveTab] = useState<TabStatus>(activeTab);
  const [prevScheduleId, setPrevScheduleId] = useState<number | undefined>(selectedScheduleId);

  if (activeTab !== prevActiveTab || selectedScheduleId !== prevScheduleId) {
    setPrevActiveTab(activeTab);
    setPrevScheduleId(selectedScheduleId);
    setReservations([]);
    setCursorId(null);
  }

  // currentParamsRef를 최신 파라미터로 동기화
  useEffect(() => {
    currentParamsRef.current = { activeTab, selectedScheduleId };
  }, [activeTab, selectedScheduleId]);

  useEffect(() => {
    let ignore = false;
    async function loadSchedules() {
      try {
        const res = await getMyActivityReservedSchedule(activityId, { date });
        if (ignore) return;
        if (!res.success) {
          setSchedules([]);
          setSelectedTime('');
          showToast.error(res.message || '스케줄을 불러오는 데 실패했습니다.');
          return;
        }
        setSchedules(res.data);
        setSelectedTime(res.data.length > 0 ? formatTimeOption(res.data[0]) : '');
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
        const res = await getMyActivityReservedSchedule(activityId, { date });
        if (ignore) return;
        if (!res.success) {
          showToast.error(res.message || '스케줄 정보를 갱신하는 데 실패했습니다.');
          return;
        }
        setSchedules((prev) =>
          prev.map(
            (prevSlot) => res.data.find((s) => s.scheduleId === prevSlot.scheduleId) ?? prevSlot
          )
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
        const res = await getMyActivityReservations(activityId, {
          scheduleId: selectedScheduleId,
          status: activeTab,
        });
        if (ignore) return;
        if (!res.success) {
          setReservations([]);
          setCursorId(null);
          showToast.error(res.message || '예약 목록을 불러오는 데 실패했습니다.');
          return;
        }
        setReservations(res.data.reservations);
        setCursorId(res.data.cursorId);
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

    const requestTab = activeTab;
    const requestScheduleId = selectedScheduleId;
    const requestCursorId = cursorId;

    isFetchingMoreRef.current = true;
    try {
      const res = await getMyActivityReservations(activityId, {
        scheduleId: requestScheduleId,
        status: requestTab,
        cursorId: requestCursorId,
      });

      // 응답이 돌아왔을 때 파라미터가 바뀌었으면 결과 버림
      if (
        currentParamsRef.current.activeTab !== requestTab ||
        currentParamsRef.current.selectedScheduleId !== requestScheduleId
      ) {
        return;
      }

      if (!res.success) {
        showToast.error(res.message || '예약 목록을 불러오는 데 실패했습니다.');
        return;
      }
      setReservations((prev) => [...prev, ...res.data.reservations]);
      setCursorId(res.data.cursorId);
    } catch {
      if (
        currentParamsRef.current.activeTab === requestTab &&
        currentParamsRef.current.selectedScheduleId === requestScheduleId
      ) {
        showToast.error('예약 목록을 불러오는 데 실패했습니다.');
      }
    } finally {
      isFetchingMoreRef.current = false;
    }
  }, [cursorId, selectedScheduleId, activityId, activeTab]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (node && scrollContainerRef.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) loadMore();
          },
          { root: scrollContainerRef.current, threshold: 0 }
        );
        observer.observe(node);
        observerRef.current = observer;
      }
    },
    [loadMore]
  );

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
    isSchedulePast,
    reservations,
    cursorId,
    sentinelRef,
    scrollContainerRef,
    refreshAfterAction,
  };
}
