'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/blocks/Calendar';
import { useKoreanHolidays } from '@/hooks/useKoreanHolidays';
import { Button } from '@/components/ui/Button';
import { getActivityAvailableSchedule, postActivityReservations } from '@/lib/api/activities';
import type { ScheduleDate } from '@/lib/api/activities/type';
import { toLocalDateString } from '../Calendar/utils';
import { cn } from '@/utils/cn';
import { totalPriceToString } from '@/utils/priceFormat';
import { showToast } from '@/utils/toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Modal } from '@/components/ui/Modal';
import WarningIcon from '@/assets/icon/WarningIcon.svg';

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

export function ReservationPaycard({
  activityId,
  price,
  activityTitle,
  className,
}: ReservationPaycardProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [schedules, setSchedules] = useState<ScheduleDate[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | undefined>(undefined);
  const [headCount, setHeadCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'fail' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('paymentStatus') as 'success' | 'fail' | null;
      if (status === 'success' || status === 'fail') {
        const timer = setTimeout(() => {
          setPaymentStatus(status);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // 공휴일 정보 가져오기
  const holidays = useKoreanHolidays(currentMonth.getFullYear(), currentMonth.getMonth());

  // 해당 월의 예약 가능한 스케줄 조회
  useEffect(() => {
    let isMounted = true;
    const fetchSchedules = async () => {
      try {
        const year = String(currentMonth.getFullYear());
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const res = await getActivityAvailableSchedule(activityId, { year, month });
        if (isMounted) {
          if (Array.isArray(res)) {
            setSchedules(res);
          } else if (res) {
            setSchedules([res as unknown as ScheduleDate]);
          } else {
            setSchedules([]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
        if (isMounted) {
          setSchedules([]);
        }
      }
    };

    fetchSchedules();
    return () => {
      isMounted = false;
    };
  }, [activityId, currentMonth]);

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

  // 선택한 날짜의 가능한 시간대 목록
  const selectedDateStr = selectedDate ? toLocalDateString(selectedDate) : '';
  const availableTimes = schedules.find((s) => s.date === selectedDateStr)?.times || [];

  // 총 합계 금액
  const totalPrice = price * headCount;

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

  const handleReservation = async () => {
    if (!selectedScheduleId) {
      showToast.error('예약할 시간대를 선택해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. 백엔드 예약 생성 (pending 상태)
      const res = await postActivityReservations(activityId, {
        scheduleId: selectedScheduleId,
        headCount,
      });

      // 2. 토스페이먼츠 SDK 호출
      if (typeof window !== 'undefined' && window.TossPayments) {
        const tossPayments = window.TossPayments('test_ck_D5aZkW6mGb7qAP1A01rd3t8oFEX5');
        const cleanUrl = window.location.origin + window.location.pathname;
        await tossPayments.requestPayment('카드', {
          amount: totalPrice,
          orderId: `res-${res.id}-${Date.now()}`,
          orderName: activityTitle,
          customerName: '홍길동',
          successUrl: `${cleanUrl}?paymentStatus=success&reservationId=${res.id}`,
          failUrl: `${cleanUrl}?paymentStatus=fail`,
        });
      } else {
        showToast.error('결제 모듈을 로드하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Reservation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        'border-border-default shadow-card w-full max-w-[380px] rounded-3xl border bg-white p-6',
        className
      )}
    >
      {/* 가격 */}
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-text-primary text-xl font-bold">{totalPriceToString(price)}</span>
        <span className="text-text-tertiary text-sm">/ 인</span>
      </div>

      <hr className="border-border-default mb-4" style={{ borderTopWidth: '1px' }} />

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
          holidays={holidays}
          isDateDisabled={isDateDisabled}
          headerVariant="secondary"
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
        <span className="text-text-primary mb-3 block text-sm font-bold">예약 가능한 시간</span>
        {selectedDate ? (
          availableTimes.length > 0 ? (
            <div className="flex flex-col gap-2">
              {availableTimes.map((time) => {
                const isSelected = selectedScheduleId === time.id;
                return (
                  <button
                    key={time.id}
                    type="button"
                    onClick={() => setSelectedScheduleId(time.id)}
                    className={cn(
                      'w-full cursor-pointer rounded-xl border py-3 text-center text-sm font-medium transition-colors',
                      isSelected
                        ? 'border-primary bg-primary-100 text-primary font-bold'
                        : 'border-border-default text-text-secondary hover:bg-gray-25 bg-white'
                    )}
                  >
                    {time.startTime} ~ {time.endTime}
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

      {paymentStatus === 'success' && (
        <ConfirmModal
          isOpen={true}
          message={`예약이 완료되었습니다.\n내 예약 확인으로 이동하시겠습니까?`}
          confirmText="확인"
          cancelText="취소"
          onConfirm={() => {
            setPaymentStatus(null);
            router.push('/my-reservations');
          }}
          onClose={() => {
            setPaymentStatus(null);
            router.replace(window.location.pathname);
          }}
        />
      )}

      {paymentStatus === 'fail' && (
        <Modal
          onClose={() => {
            setPaymentStatus(null);
            router.replace(window.location.pathname);
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
                router.replace(window.location.pathname);
              }}
              className="w-full"
            >
              확인
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
