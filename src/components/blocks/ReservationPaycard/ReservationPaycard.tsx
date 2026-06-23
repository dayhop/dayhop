'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/blocks/Calendar';
import { useKoreanHolidays } from '@/hooks/useKoreanHolidays';
import { Button } from '@/components/ui/Button';
import { getActivityAvailableSchedule, postActivityReservations } from '@/lib/api/activities';
import { getMyReservations } from '@/lib/api/my-reservations';
import type { ScheduleDate } from '@/lib/api/activities/type';
import { toLocalDateString } from '../Calendar/utils';
import { cn } from '@/utils/cn';
import { totalPriceToString } from '@/utils/priceFormat';
import { showToast } from '@/utils/toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import WarningIcon from '@/assets/icon/WarningIcon.svg';
import { useAuthStore } from '@/store/useAuthStore';

// 토스페이먼츠 SDK window 객체 타입 확장
declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (method: string, options: Record<string, unknown>) => Promise<unknown>;
    };
  }
}

interface ReservationPaycardProps {
  activityId: number;
  price: number;
  activityTitle: string;
  className?: string;
}

function getTimestamp(): number {
  return Date.now();
}

const MONTH_SEARCH_CAP = 12;

const parseScheduleDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export function ReservationPaycard({
  activityId,
  price,
  activityTitle,
  className,
}: ReservationPaycardProps) {
  const router = useRouter();
  const { user, isLogin } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [schedules, setSchedules] = useState<ScheduleDate[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | undefined>(undefined);
  const [headCount, setHeadCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'fail' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reservedScheduleIds, setReservedScheduleIds] = useState<Set<number>>(new Set());
  const [scheduleChecked, setScheduleChecked] = useState<boolean>(false);
  const [hasAvailableSchedule, setHasAvailableSchedule] = useState<boolean>(true);
  const scheduleCacheRef = useRef<Map<string, ScheduleDate[]>>(new Map());
  const paymentProcessedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (paymentProcessedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const status = params.get('paymentStatus') as 'success' | 'fail' | null;
    if (status !== 'success' && status !== 'fail') return;

    paymentProcessedRef.current = true;

    if (status === 'fail') {
      setTimeout(() => setPaymentStatus('fail'), 0);
      return;
    }

    const scheduleId = Number(params.get('scheduleId'));
    const reserveHeadCount = Number(params.get('headCount'));
    if (!scheduleId || !reserveHeadCount) return;

    (async () => {
      const res = await postActivityReservations(activityId, {
        scheduleId,
        headCount: reserveHeadCount,
      });
      window.history.replaceState(null, '', window.location.pathname);
      if (res.success) {
        setReservedScheduleIds((prev) => new Set(prev).add(scheduleId));
        setPaymentStatus('success');
      } else {
        showToast.error(res.message);
      }
    })();
  }, [activityId]);

  useEffect(() => {
    if (!isLogin) return;
    let active = true;
    (async () => {
      const res = await getMyReservations({ size: 100 });
      if (!active || !res.success) return;
      const ids = res.data.reservations
        .filter(
          (r) => r.activity.id === activityId && r.status !== 'canceled' && r.status !== 'declined'
        )
        .map((r) => r.scheduleId);
      setReservedScheduleIds((prev) => new Set([...prev, ...ids]));
    })();
    return () => {
      active = false;
    };
  }, [activityId, isLogin]);

  // 공휴일 정보 가져오기
  const holidays = useKoreanHolidays(currentMonth.getFullYear(), currentMonth.getMonth());

  const fetchMonthSchedules = useCallback(
    async (year: string, month: string): Promise<ScheduleDate[]> => {
      const key = `${activityId}-${year}-${month}`;
      const cached = scheduleCacheRef.current.get(key);
      if (cached) return cached;

      const res = await getActivityAvailableSchedule(activityId, { year, month });
      let list: ScheduleDate[] = [];
      if (res.success) {
        const data = res.data;
        list = Array.isArray(data) ? data : [data as unknown as ScheduleDate];
      }
      scheduleCacheRef.current.set(key, list);
      return list;
    },
    [activityId]
  );

  const findAdjacentAvailableDate = useCallback(
    async (fromDate: Date, direction: 1 | -1, inclusive: boolean): Promise<Date | null> => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const fromStart = new Date(fromDate);
      fromStart.setHours(0, 0, 0, 0);

      let searchMonth = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);

      for (let i = 0; i < MONTH_SEARCH_CAP; i++) {
        if (direction === -1) {
          const searchMonthEnd = new Date(searchMonth.getFullYear(), searchMonth.getMonth() + 1, 0);
          searchMonthEnd.setHours(0, 0, 0, 0);
          if (searchMonthEnd < todayStart) break;
        }

        const year = String(searchMonth.getFullYear());
        const month = String(searchMonth.getMonth() + 1).padStart(2, '0');
        const monthSchedules = await fetchMonthSchedules(year, month);

        const candidates = monthSchedules
          .filter((s) => s.times.length > 0)
          .map((s) => parseScheduleDate(s.date))
          .filter((date) => {
            if (date < todayStart) return false;
            const diff = date.getTime() - fromStart.getTime();
            if (direction === 1) return inclusive ? diff >= 0 : diff > 0;
            return inclusive ? diff <= 0 : diff < 0;
          })
          .sort((a, b) =>
            direction === 1 ? a.getTime() - b.getTime() : b.getTime() - a.getTime()
          );

        if (candidates.length > 0) return candidates[0];

        searchMonth = new Date(searchMonth.getFullYear(), searchMonth.getMonth() + direction, 1);
      }

      return null;
    },
    [fetchMonthSchedules]
  );

  // 해당 월의 예약 가능한 스케줄 조회
  useEffect(() => {
    let isMounted = true;
    const loadSchedules = async () => {
      const year = String(currentMonth.getFullYear());
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const list = await fetchMonthSchedules(year, month);
      if (isMounted) setSchedules(list);
    };

    loadSchedules();
    return () => {
      isMounted = false;
    };
  }, [currentMonth, fetchMonthSchedules]);

  // 첫 렌더 시 가장 빠른 예약 가능일로 이동
  useEffect(() => {
    let cancelled = false;
    const initToFirstAvailable = async () => {
      const firstDate = await findAdjacentAvailableDate(new Date(), 1, true);
      if (cancelled) return;
      setScheduleChecked(true);
      if (!firstDate) {
        setHasAvailableSchedule(false);
        return;
      }
      setHasAvailableSchedule(true);
      setCurrentMonth(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
      setSelectedDate(firstDate);
      setSelectedScheduleId(undefined);
    };

    initToFirstAvailable();
    return () => {
      cancelled = true;
    };
  }, [findAdjacentAvailableDate]);

  const handleNavigateToAdjacentDate = async (direction: 1 | -1) => {
    const base = selectedDate ?? new Date();
    const target = await findAdjacentAvailableDate(base, direction, false);
    if (!target) {
      showToast.error(
        direction === 1 ? '이후 예약 가능한 날짜가 없습니다.' : '이전 예약 가능한 날짜가 없습니다.'
      );
      return;
    }
    setCurrentMonth(new Date(target.getFullYear(), target.getMonth(), 1));
    setSelectedDate(target);
    setSelectedScheduleId(undefined);
  };

  // 스케줄 유무 및 과거 날짜 여부 확인하여 캘린더 날짜 비활성화
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < today) return true;

    const dateStr = toLocalDateString(targetDate);
    const daySchedule = schedules.find((s) => s.date === dateStr);
    return !daySchedule || daySchedule.times.length === 0;
  };

  // 선택한 날짜의 가능한 시간대 목록 (오늘 날짜의 경우, 현재 시간 이후의 슬롯만 필터링)
  const today = new Date();
  const isSelectedDateToday =
    selectedDate &&
    selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getDate() === today.getDate();

  const selectedDateStr = selectedDate ? toLocalDateString(selectedDate) : '';
  const availableTimes = (schedules.find((s) => s.date === selectedDateStr)?.times || []).filter(
    (time) => {
      if (!isSelectedDateToday) return true;
      const [startHour, startMin] = time.startTime.split(':').map(Number);
      const slotStartTime = new Date(selectedDate!);
      slotStartTime.setHours(startHour, startMin, 0, 0);
      return slotStartTime >= today;
    }
  );

  const selectedTimeSlot = availableTimes.find((time) => time.id === selectedScheduleId);

  // 총 합계 금액
  const totalPrice = price * headCount;

  const showEmpty = scheduleChecked && !hasAvailableSchedule;

  // 토스페이먼츠 SDK 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleDecreaseHeadCount = () => {
    setHeadCount((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseHeadCount = () => {
    setHeadCount((prev) => prev + 1);
  };

  const handleBottomBarReserve = () => {
    if (!selectedScheduleId) {
      setIsModalOpen(true);
      return;
    }
    handleReservation();
  };

  const handleReservation = async () => {
    if (!isLogin) {
      showToast.error('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!selectedScheduleId) {
      showToast.error('예약할 시간대를 선택해 주세요.');
      return;
    }

    // 오늘 날짜 기준으로 이미 시간이 지난 슬롯인 경우 얼리 리턴
    if (selectedDate && selectedTimeSlot) {
      const todayVal = new Date();
      const isToday =
        selectedDate.getFullYear() === todayVal.getFullYear() &&
        selectedDate.getMonth() === todayVal.getMonth() &&
        selectedDate.getDate() === todayVal.getDate();

      if (isToday) {
        const [startHour, startMin] = selectedTimeSlot.startTime.split(':').map(Number);
        const slotStartTime = new Date(selectedDate);
        slotStartTime.setHours(startHour, startMin, 0, 0);

        if (slotStartTime < todayVal) {
          showToast.error('이미 시간이 지난 일정은 예약할 수 없습니다.');
          return;
        }
      }
    }

    setIsSubmitting(true);

    // 토스페이먼츠 SDK 호출
    if (typeof window !== 'undefined' && window.TossPayments) {
      const clientKey =
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
      const tossPayments = window.TossPayments(clientKey);
      const cleanUrl = window.location.origin + window.location.pathname;
      try {
        await tossPayments.requestPayment('카드', {
          amount: totalPrice,
          orderId: `dayhop-${activityId}-${selectedScheduleId}-${getTimestamp()}`,
          orderName: activityTitle,
          customerName: user?.nickname || '구매자',
          successUrl: `${cleanUrl}?paymentStatus=success&scheduleId=${selectedScheduleId}&headCount=${headCount}`,
          failUrl: `${cleanUrl}?paymentStatus=fail`,
        });
      } catch (paymentError) {
        console.error('Payment request failed:', paymentError);
      }
    } else {
      showToast.error('결제 모듈을 로드하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
    setIsSubmitting(false);
  };

  const headerDateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : undefined;

  return (
    <>
      {/* 1. 데스크톱 뷰 카드 (lg 이상일 때만 보임) */}
      <div
        className={cn(
          'border-border-default shadow-card hidden w-full max-w-[380px] rounded-3xl border bg-white p-6 lg:block',
          className
        )}
      >
        {/* 가격 */}
        <div className="mb-4 flex items-baseline gap-1">
          <span className="text-text-primary text-xl font-bold">{totalPriceToString(price)}</span>
          <span className="text-text-tertiary text-sm">/ 인</span>
        </div>

        <hr className="border-border-default mb-4" style={{ borderTopWidth: '1px' }} />

        {showEmpty ? (
          <EmptyState message="현재 예약 가능한 일정이 없습니다." />
        ) : (
          <>
            {/* 날짜 선택 달력 */}
            <div className="mb-4 [&_.grid[class*='h-130']]:!h-[240px] [&_.grid[class*='h-155']]:md:!h-[240px] [&_button]:flex [&_button]:!h-[36px] [&_button]:items-center [&_button]:justify-center [&_button_span]:flex [&_button_span]:!h-full [&_button_span]:!w-full [&_button_span]:items-center [&_button_span]:justify-center [&_button_span_span]:!mt-0 [&_button_span_span]:flex [&_button_span_span]:!h-[28px] [&_button_span_span]:!w-[28px] [&_button_span_span]:items-center [&_button_span_span]:justify-center [&_button_span_span]:!text-[13px]">
              <Calendar
                value={selectedDate}
                defaultMonth={currentMonth}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedScheduleId(undefined);
                }}
                onMonthChange={setCurrentMonth}
                onNavigatePrev={() => handleNavigateToAdjacentDate(-1)}
                onNavigateNext={() => handleNavigateToAdjacentDate(1)}
                headerTitle={headerDateLabel}
                holidays={holidays}
                isDateDisabled={isDateDisabled}
                headerVariant="secondary"
                clickableDateCellClassName="hover:bg-(--color-bg-surface) hover:text-(--color-text-primary)"
                className="w-full text-sm"
                selectedClassName="bg-primary text-white"
              />
            </div>

            {/* 참여 인원 수 */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-text-primary text-sm font-bold">참여 인원 수</span>
              <div className="border-border-default flex items-center gap-3 rounded-lg border px-3 py-1.5">
                <button
                  type="button"
                  onClick={handleDecreaseHeadCount}
                  disabled={headCount <= 1}
                  className="text-text-placeholder hover:text-text-secondary cursor-pointer text-lg font-bold disabled:opacity-30"
                >
                  －
                </button>
                <span className="text-text-secondary min-w-8 text-center text-sm font-medium">
                  {headCount}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseHeadCount}
                  className="text-text-placeholder hover:text-text-secondary cursor-pointer text-lg font-bold"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* 예약 가능한 시간 */}
            <div className="mb-6">
              <span className="text-text-primary mb-3 block text-sm font-bold">
                예약 가능한 시간
              </span>
              {selectedDate ? (
                availableTimes.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {availableTimes.map((time) => {
                      const isSelected = selectedScheduleId === time.id;
                      const isReserved = reservedScheduleIds.has(time.id);
                      return (
                        <button
                          key={time.id}
                          type="button"
                          disabled={isReserved}
                          onClick={() => setSelectedScheduleId(isSelected ? undefined : time.id)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-150',
                            isReserved
                              ? 'border-border-default text-text-placeholder cursor-not-allowed bg-gray-50'
                              : isSelected
                                ? 'border-primary bg-primary-100 text-primary cursor-pointer font-bold'
                                : 'border-border-default text-text-secondary hover:bg-gray-25 cursor-pointer bg-white'
                          )}
                        >
                          <span>
                            {time.startTime} ~ {time.endTime}
                          </span>
                          {isReserved ? (
                            <span className="text-xs font-semibold">이미 예약함</span>
                          ) : (
                            <div
                              className={cn(
                                'flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-border-default bg-white'
                              )}
                            >
                              {isSelected && (
                                <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                </svg>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-text-placeholder py-4 text-center text-xs">
                    선택한 날짜에 가능한 시간대가 없습니다.
                  </p>
                )
              ) : (
                <p className="text-text-placeholder py-4 text-center text-xs">
                  날짜를 먼저 선택해 주세요.
                </p>
              )}
            </div>

            <hr className="border-border-default mb-6" style={{ borderTopWidth: '1px' }} />

            {/* 총 합계 및 예약하기 버튼 */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-text-secondary text-xs font-bold">총 합계</span>
                <span className="text-text-primary text-lg font-bold">
                  {totalPriceToString(totalPrice)}
                </span>
              </div>
              <Button
                onClick={handleReservation}
                disabled={!selectedDate || !selectedScheduleId || isSubmitting}
                className="!h-12 max-w-[150px] flex-1 !rounded-xl !px-0 text-sm whitespace-nowrap"
              >
                {isSubmitting ? '처리 중...' : '예약하기'}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 2. 모바일/태블릿 하단 고정 플로팅 바 (lg 미만일 때만 보임) */}
      <div className="border-border-default fixed right-0 bottom-0 left-0 z-40 border-t bg-white px-6 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] lg:hidden">
        <div className="mx-auto flex max-w-[768px] flex-col gap-3">
          {showEmpty ? (
            <p className="text-text-tertiary py-2 text-center text-sm font-medium">
              현재 예약 가능한 일정이 없습니다.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                {/* Left side: Price and Headcount */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-text-primary text-xl font-extrabold">
                    {totalPriceToString(totalPrice)}
                  </span>
                  <span className="text-text-tertiary text-sm">/ {headCount}명</span>
                </div>

                {/* Right side: Date Selection Link */}
                <div>
                  {selectedDate && selectedTimeSlot ? (
                    <div className="flex items-center gap-2">
                      <span className="text-primary text-xs font-semibold">
                        {toLocalDateString(selectedDate)} {selectedTimeSlot.startTime}~
                        {selectedTimeSlot.endTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="text-text-secondary hover:text-text-primary cursor-pointer text-xs font-medium underline"
                      >
                        변경
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="text-primary cursor-pointer text-sm font-semibold underline"
                    >
                      날짜 선택하기
                    </button>
                  )}
                </div>
              </div>

              <Button
                onClick={handleBottomBarReserve}
                disabled={isSubmitting}
                className="!h-12 w-full !rounded-xl text-base font-bold"
              >
                {isSubmitting ? '처리 중...' : '예약하기'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 3. 모바일/태블릿용 날짜/시간/인원수 선택 슬라이드업 바텀 시트 */}
      {/* 백드롭 배경 */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden',
          isModalOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsModalOpen(false)}
      />

      {/* 바텀 시트 본체 */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out lg:hidden',
          isModalOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* 헤더 */}
        <div className="border-border-default mb-4 flex items-center justify-between border-b pb-3">
          <h3 className="text-text-primary text-lg font-bold">날짜</h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-text-placeholder hover:text-text-secondary cursor-pointer p-1 text-2xl leading-none font-bold"
          >
            &times;
          </button>
        </div>

        {/* 본문 콘텐츠: 태블릿에선 가로로(side-by-side), 모바일에선 세로로 */}
        <div className="flex flex-col gap-6 overflow-y-auto md:flex-row md:items-start">
          {/* 왼쪽: 달력 & 인원수 선택 */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="[&_.grid[class*='h-130']]:!h-[240px] [&_.grid[class*='h-155']]:md:!h-[240px] [&_button]:flex [&_button]:!h-[36px] [&_button]:items-center [&_button]:justify-center [&_button_span]:flex [&_button_span]:!h-full [&_button_span]:!w-full [&_button_span]:items-center [&_button_span]:justify-center [&_button_span_span]:!mt-0 [&_button_span_span]:flex [&_button_span_span]:!h-[28px] [&_button_span_span]:!w-[28px] [&_button_span_span]:items-center [&_button_span_span]:justify-center [&_button_span_span]:!text-[13px]">
              <Calendar
                value={selectedDate}
                defaultMonth={currentMonth}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedScheduleId(undefined);
                }}
                onMonthChange={setCurrentMonth}
                onNavigatePrev={() => handleNavigateToAdjacentDate(-1)}
                onNavigateNext={() => handleNavigateToAdjacentDate(1)}
                headerTitle={headerDateLabel}
                holidays={holidays}
                isDateDisabled={isDateDisabled}
                headerVariant="secondary"
                clickableDateCellClassName="hover:bg-(--color-bg-surface) hover:text-(--color-text-primary)"
                className="w-full text-sm"
                selectedClassName="bg-primary text-white"
              />
            </div>

            <hr className="border-border-default" style={{ borderTopWidth: '1px' }} />

            {/* 참여 인원 수 */}
            <div className="flex items-center justify-between py-2">
              <span className="text-text-primary text-sm font-bold">참여 인원 수</span>
              <div className="border-border-default flex items-center gap-3 rounded-lg border px-3 py-1.5">
                <button
                  type="button"
                  onClick={handleDecreaseHeadCount}
                  disabled={headCount <= 1}
                  className="text-text-placeholder hover:text-text-secondary cursor-pointer text-lg font-bold disabled:opacity-30"
                >
                  －
                </button>
                <span className="text-text-secondary min-w-8 text-center text-sm font-medium">
                  {headCount}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseHeadCount}
                  className="text-text-placeholder hover:text-text-secondary cursor-pointer text-lg font-bold"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* 태블릿용 구분선 */}
          <div className="bg-border-default hidden w-px self-stretch md:block" />

          {/* 오른쪽: 예약 가능한 시간 */}
          <div className="w-full flex-1">
            <span className="text-text-primary mb-3 block text-sm font-bold">예약 가능한 시간</span>
            {selectedDate ? (
              availableTimes.length > 0 ? (
                <div className="flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-1">
                  {availableTimes.map((time) => {
                    const isSelected = selectedScheduleId === time.id;
                    const isReserved = reservedScheduleIds.has(time.id);
                    return (
                      <button
                        key={time.id}
                        type="button"
                        disabled={isReserved}
                        onClick={() => setSelectedScheduleId(isSelected ? undefined : time.id)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-150',
                          isReserved
                            ? 'border-border-default text-text-placeholder cursor-not-allowed bg-gray-50'
                            : isSelected
                              ? 'border-primary bg-primary-100 text-primary cursor-pointer font-bold'
                              : 'border-border-default text-text-secondary hover:bg-gray-25 cursor-pointer bg-white'
                        )}
                      >
                        <span>
                          {time.startTime} ~ {time.endTime}
                        </span>
                        {isReserved ? (
                          <span className="text-xs font-semibold">이미 예약함</span>
                        ) : (
                          <div
                            className={cn(
                              'flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors',
                              isSelected
                                ? 'border-primary bg-primary text-white'
                                : 'border-border-default bg-white'
                            )}
                          >
                            {isSelected && (
                              <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-text-placeholder py-8 text-center text-xs">
                  선택한 날짜에 가능한 시간대가 없습니다.
                </p>
              )
            ) : (
              <div className="border-border-default flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
                <p className="text-text-placeholder text-sm font-medium">날짜를 선택해주세요.</p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 확인 버튼 */}
        <div className="border-border-default mt-6 border-t pt-4">
          <Button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="!h-12 w-full !rounded-xl text-base font-bold"
          >
            확인
          </Button>
        </div>
      </div>

      {/* 공통 에러/성공 알림 모달 */}
      {paymentStatus === 'success' && (
        <ConfirmModal
          isOpen={true}
          message={`예약이 완료되었습니다.\n내 예약 확인으로 이동하시겠습니까?`}
          confirmText="확인"
          cancelText="취소"
          onConfirm={() => {
            setPaymentStatus(null);
            router.push('/mypage/reservations');
          }}
          onClose={() => {
            setPaymentStatus(null);
            window.history.replaceState(null, '', window.location.pathname);
          }}
        />
      )}

      {paymentStatus === 'fail' && (
        <Modal
          onClose={() => {
            setPaymentStatus(null);
            window.history.replaceState(null, '', window.location.pathname);
          }}
          className="w-[320px] max-w-[calc(100vw-32px)] !p-8 md:w-[400px]"
        >
          <div className="flex flex-col items-center text-center">
            <WarningIcon className="mb-4 h-[88px] w-[88px]" />
            <div className="text-text-primary mb-8 text-base leading-normal font-bold whitespace-pre-wrap">
              결제에 실패하였습니다. 다시 시도해 주세요.
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setPaymentStatus(null);
                window.history.replaceState(null, '', window.location.pathname);
              }}
              className="w-full"
            >
              확인
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
