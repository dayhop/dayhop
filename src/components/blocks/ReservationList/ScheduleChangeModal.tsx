import { Schedule } from '@/lib/api/activities/type';
import { Button } from '@/components/ui/Button';
import { patchMyReservationApplication } from '@/lib/api/my-reservations';
import { Reservation } from '@/lib/api/my-reservations/type';
import { showToast } from '@/utils/toast';
import { useEffect, useState } from 'react';
import { getActivity } from '@/lib/api/activities';
import { Modal } from '@/components/ui/Modal';

interface ScheduleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
}

export function ScheduleChangeModal({ isOpen, onClose, reservation }: ScheduleChangeModalProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [headCount, setHeadCount] = useState(reservation.headCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        const activity = await getActivity(reservation.activity.id);
        const allSchedules = activity.schedules;
        const availableSchedules = allSchedules.filter(
          (schedule) => schedule.id !== reservation.scheduleId
        );
        setSchedules(availableSchedules);
      } catch (error) {
        showToast.error('일정 정보를 불러오는데 실패했습니다.');
        onClose();
      } finally {
        setIsLoading(false);
        setSelectedScheduleId(null);
      }
    };

    fetchSchedules();
  }, [isOpen, onClose, reservation.activity.id, reservation.scheduleId]);

  const handleConfirm = async () => {
    if (!selectedScheduleId) return;

    const body = {
      scheduleId: selectedScheduleId,
      headCount: headCount,
    };

    try {
      await patchMyReservationApplication({ reservationId: reservation.id }, body);
      showToast.success('예약 일정이 변경되었습니다.');
      window.location.reload();
    } catch (error) {
      showToast.error('예약 변경에 실패했습니다.');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal className="w-fit min-w-97.5" ariaLabel="예약 변경 모달" onClose={onClose}>
      <div
        className="custom-textarea-scrollbar w-full max-w-sm rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">예약 변경</h2>
        <p className="mt-2 text-sm text-gray-500">변경할 예약 날짜를 선택해주세요.</p>
        <div className="my-4 max-h-60 overflow-y-auto">
          {isLoading ? (
            <p className="py-8 text-center text-gray-500">일정 목록을 불러오는 중...</p>
          ) : schedules.length > 0 ? (
            <div>
              <ul className="space-y-2">
                {schedules.map((schedule) => (
                  <li
                    key={schedule.id}
                    className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-gray-50 ${selectedScheduleId === schedule.id ? 'border-text-primary bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setSelectedScheduleId(schedule.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedScheduleId(schedule.id);
                    }}
                    tabIndex={0}
                    role="radio"
                    aria-checked={selectedScheduleId === schedule.id}
                  >
                    <p className="font-semibold">{schedule.date}</p>
                    <p className="text-sm text-gray-600">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">예약 인원</p>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-1">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setHeadCount((prev) => Math.max(1, prev - 1))}
                    disabled={headCount <= 1}
                    aria-label="인원 감소"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-gray-800">{headCount}</span>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setHeadCount((prev) => Math.min(10, prev + 1))}
                    disabled={headCount >= 10}
                    aria-label="인원 증가"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">변경 가능한 다른 일정이 없습니다.</p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedScheduleId}>
            변경하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
