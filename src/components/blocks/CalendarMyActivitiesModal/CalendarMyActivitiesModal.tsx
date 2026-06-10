'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import CloseIcon from '@/assets/icon/CloseIcon.svg';
import { cn } from '@/utils/cn';
import { ReservationItem } from './ReservationItem';
import { SelectField } from '@/components/ui/SelectField';
import { getMyActivityReservedSchedule } from '@/lib/api/my-activities';
import type {
  GetMyActivityReservationsParams,
  GetMyActivityReservedScheduleResponse,
} from '@/lib/api/my-activities/type';

interface CalendarMyActivitiesModalProps {
  activityId: number;
  date: string; // YYYY-MM-DD
  onClose: () => void;
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
  className,
  overlayClassName,
}: CalendarMyActivitiesModalProps) => {
  const [activeTab, setActiveTab] = useState<TabStatus>('pending');
  const [schedules, setSchedules] = useState<GetMyActivityReservedScheduleResponse[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    async function loadSchedules() {
      setSchedules([]);
      setSelectedTime('');
      const data = await getMyActivityReservedSchedule(activityId, { date });
      setSchedules(data);
      if (data.length > 0) setSelectedTime(formatTimeOption(data[0]));
    }
    loadSchedules();
  }, [activityId, date]);

  const selectedSchedule = schedules.find((s) => formatTimeOption(s) === selectedTime);

  return (
    <Modal
      onClose={onClose}
      ariaLabel="예약 현황 모달"
      className={className}
      overlayClassName={overlayClassName}
    >
      {/* 헤더 */}
      <div className="mb-3 flex items-center justify-between px-6">
        <span className="text-text-primary text-lg font-bold lg:text-[20px]">
          {formatDate(date)}
        </span>
        <button onClick={onClose} className="hidden cursor-pointer lg:block">
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 탭 */}
        <div className="before:bg-border-default relative mx-6 flex gap-2 before:absolute before:right-0 before:bottom-0 before:left-0 before:h-px before:content-[''] lg:text-base">
          {TABS.map(({ status, label }) => {
            const isActive = activeTab === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveTab(status)}
                className={cn(
                  'text-text-tertiary relative flex h-10 flex-1 cursor-pointer items-center justify-center gap-1 text-base font-medium',
                  isActive &&
                    "text-primary-500 before:bg-primary-500 font-bold before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:content-['']"
                )}
              >
                <span>{label}</span> <span>{selectedSchedule?.count[status] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <div className="custom-textarea-scrollbar flex max-h-90 flex-col gap-7.5 overflow-y-auto px-6 pt-7.5 md:flex-row md:gap-5 lg:flex-col">
          {/* 예약 시간 */}
          <div className="flex flex-col gap-3 md:flex-1">
            <h3 className="text-text-primary text-base font-bold lg:text-lg">예약 시간</h3>
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
            <h3 className="text-text-primary text-base font-bold lg:text-lg">예약 내역</h3>
            <ul className="flex flex-col gap-3.5">
              <ReservationItem
                nickname="정만철"
                headCount={10}
                activeTab={activeTab}
                onApprove={() => console.log('승인')}
                onDecline={() => console.log('거절')}
              />
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};
