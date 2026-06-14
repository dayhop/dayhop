'use client';

import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@/assets/icon/CloseIcon.svg';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { SelectField } from '@/components/ui/SelectField';
import { cn } from '@/utils/cn';
import { showToast } from '@/utils/toast';
import { ReservationItem } from './ReservationItem';
import { isPastTime } from '../Calendar/utils';
import {
  getMyActivityReservedSchedule,
  getMyActivityReservations,
  patchMyActivityReservationStatus,
} from '@/lib/api/my-activities';
import type {
  GetMyActivityReservationsParams,
  GetMyActivityReservedScheduleResponse,
  MyActivityReservation,
} from '@/lib/api/my-activities/type';

interface CalendarMyActivitiesModalProps {
  activityId: number;
  date: string; // YYYY-MM-DD
  onClose: () => void;
  onReservationChange?: () => void;
  className?: string;
  overlayClassName?: string;
}

type TabStatus = GetMyActivityReservationsParams['status'];

const TABS: { status: TabStatus; label: string }[] = [
  { status: 'pending', label: '신청' },
  { status: 'confirmed', label: '승인' },
  { status: 'declined', label: '거절' },
];

function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${String(year).slice(2)}년 ${Number(month)}월 ${Number(day)}일`;
}

function formatTimeOption(schedule: GetMyActivityReservedScheduleResponse) {
  return `${schedule.startTime} - ${schedule.endTime}`;
}

export const CalendarMyActivitiesModal = ({
  activityId,
  date,
  onClose,
  onReservationChange,
  className,
  overlayClassName,
}: CalendarMyActivitiesModalProps) => {
  const [activeTab, setActiveTab] = useState<TabStatus>('pending');
  const [schedules, setSchedules] = useState<GetMyActivityReservedScheduleResponse[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reservations, setReservations] = useState<MyActivityReservation[]>([]);
  const [pendingAction, setPendingAction] = useState<{
    type: 'confirmed' | 'declined';
    execute: () => Promise<void>;
  } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const selectedTimeRef = useRef(selectedTime);
  useEffect(() => {
    selectedTimeRef.current = selectedTime;
  }, [selectedTime]);

  useEffect(() => {
    let ignore = false;
    async function loadSchedules() {
      try {
        const data = await getMyActivityReservedSchedule(activityId, { date });
        if (ignore) return;
        setSchedules(data);
        const currentTime = selectedTimeRef.current;
        const isStillAvailable = data.some((s) => formatTimeOption(s) === currentTime);
        setSelectedTime(
          isStillAvailable ? currentTime : data.length > 0 ? formatTimeOption(data[0]) : ''
        );
        setReservations([]);
      } catch {
        if (!ignore) {
          setSchedules([]);
          setSelectedTime('');
          setReservations([]);
        }
      }
    }
    loadSchedules();
    return () => {
      ignore = true;
    };
  }, [activityId, date, refreshTrigger]);

  const selectedSchedule = schedules.find((s) => formatTimeOption(s) === selectedTime);
  const selectedScheduleId = selectedSchedule?.scheduleId;
  const isSchedulePast = selectedSchedule ? isPastTime(date, selectedSchedule.endTime) : false;

  useEffect(() => {
    let ignore = false;
    async function loadReservations() {
      if (selectedScheduleId === undefined) {
        setReservations([]);
        return;
      }
      try {
        const data = await getMyActivityReservations(activityId, {
          scheduleId: selectedScheduleId,
          status: activeTab,
        });
        if (ignore) return;
        setReservations(data.reservations);
      } catch {
        if (!ignore) setReservations([]);
      }
    }
    loadReservations();
    return () => {
      ignore = true;
    };
  }, [activityId, selectedScheduleId, activeTab, refreshTrigger]);

  const refreshAfterAction = () => {
    setRefreshTrigger((prev) => prev + 1);
    onReservationChange?.();
  };

  return (
    <>
      <Modal
        onClose={onClose}
        ariaLabel="예약 현황 모달"
        className={className}
        overlayClassName={overlayClassName}
      >
        {/* 헤더 */}
        <div className="mb-3 flex items-center justify-between px-6">
          <span className="text-text-primary text-lg leading-none font-bold lg:text-[20px]">
            {formatDate(date)}
          </span>
          <button onClick={onClose} className="hidden cursor-pointer lg:block">
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 탭 */}
          <div className="before:bg-border-default relative mx-6 flex before:absolute before:right-0 before:bottom-0 before:left-0 before:h-px before:content-[''] lg:text-base">
            {TABS.map(({ status, label }) => {
              const isActive = activeTab === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveTab(status)}
                  className={cn(
                    'text-text-tertiary relative flex h-10 flex-1 cursor-pointer items-center justify-center gap-1 text-base font-medium',
                    isActive && 'text-primary-500 font-bold'
                  )}
                >
                  <span>{label}</span> <span>{selectedSchedule?.count[status] ?? 0}</span>
                </button>
              );
            })}
            <div
              className="bg-primary-500 absolute bottom-0 h-0.5 w-1/3 transition-transform duration-200 ease-in-out"
              style={{
                transform: `translateX(${TABS.findIndex((t) => t.status === activeTab) * 100}%)`,
              }}
            />
          </div>

          <div className="custom-textarea-scrollbar flex max-h-90 flex-col gap-7.5 overflow-y-auto px-6 pt-7.5 md:flex-row md:gap-5 lg:min-w-85 lg:flex-col">
            {/* 예약 시간 */}
            <div className="flex flex-col gap-3 md:flex-1">
              <h3 className="text-text-primary text-base leading-[1.15] font-bold lg:text-lg">
                예약 시간
              </h3>
              <SelectField
                list={schedules.map(formatTimeOption)}
                onSelectOption={setSelectedTime}
                selectedOption={selectedTime}
                defaultMessage={
                  schedules.length === 0 ? '예약된 시간대가 없습니다' : '시간대를 선택해 주세요'
                }
                disabled={schedules.length === 0}
              />
            </div>

            {/* 예약 내역 */}
            <div className="flex flex-col gap-3 md:flex-1">
              <h3 className="text-text-primary text-base leading-[1.15] font-bold lg:text-lg">
                예약 내역
              </h3>
              {reservations.length === 0 ? (
                <div className="flex min-h-25 flex-col">
                  <p className="text-text-tertiary py-10 text-center text-sm md:p-0 md:pt-5">
                    예약 내역이 없습니다
                  </p>
                </div>
              ) : (
                <div className="flex min-h-25 flex-col">
                  <ul className="flex flex-col gap-3.5">
                    {reservations.map((reservation) => (
                      <ReservationItem
                        key={reservation.id}
                        nickname={reservation.nickname}
                        headCount={reservation.headCount}
                        activeTab={activeTab}
                        isPast={isSchedulePast}
                        onApprove={() =>
                          setPendingAction({
                            type: 'confirmed',
                            execute: async () => {
                              await patchMyActivityReservationStatus(activityId, reservation.id, {
                                status: 'confirmed',
                              });
                              refreshAfterAction();
                            },
                          })
                        }
                        onDecline={() =>
                          setPendingAction({
                            type: 'declined',
                            execute: async () => {
                              await patchMyActivityReservationStatus(activityId, reservation.id, {
                                status: 'declined',
                              });
                              refreshAfterAction();
                            },
                          })
                        }
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <ConfirmModal
        isOpen={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={async () => {
          if (!pendingAction) return;
          const isConfirmed = pendingAction.type === 'confirmed';
          try {
            await pendingAction.execute();
            showToast.success(isConfirmed ? '예약이 승인되었습니다.' : '예약이 거절되었습니다.');
          } catch {
            showToast.error(
              isConfirmed ? '예약 승인에 실패했습니다.' : '예약 거절에 실패했습니다.'
            );
          } finally {
            setPendingAction(null);
          }
        }}
        message={
          pendingAction?.type === 'confirmed'
            ? '예약을 승인하시겠습니까?'
            : '예약을 거절하시겠습니까?'
        }
        confirmText={pendingAction?.type === 'confirmed' ? '승인' : '거절'}
      />
    </>
  );
};
