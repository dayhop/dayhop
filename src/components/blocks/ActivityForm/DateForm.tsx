'use client';

import { useState, useImperativeHandle, type Ref, useEffect } from 'react';
import { CreateTimeSlotForm } from './CreateTimeSlotForm';
import { AddedTimeSlotForm } from './AddedTimeSlotForm';
import { ActivityScheduleInput } from '@/types/api';
import { showToast } from '@/utils/toast';
import { ActivityResponse } from '@/lib/api/activities/type';

export interface DateFormRef {
  getValues: () => ActivityScheduleInput[];
}

export interface ScheduleItem extends ActivityScheduleInput {
  id: string;
}

export function DateForm({ ref, data }: { ref?: Ref<DateFormRef>; data?: ActivityResponse }) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const matchId = () => {
      if (data?.schedules) {
        const initialSchedulesWithId = data.schedules.map((schedule) => ({
          ...schedule,
          id: crypto.randomUUID(),
        }));
        setSchedules(initialSchedulesWithId);
      }
    };
    matchId();
  }, [data]);

  useImperativeHandle(ref, () => ({
    getValues: () =>
      schedules.map((s) => ({
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
  }));

  const handleAddSchedule = (newData: ActivityScheduleInput) => {
    //중복 검사
    const isDuplicate = schedules.some(
      (schedule) =>
        schedule.date === newData.date &&
        schedule.startTime === newData.startTime &&
        schedule.endTime === newData.endTime
    );

    if (isDuplicate) {
      showToast.error('이미 등록된 시간대입니다.');
      return;
    }
    setSchedules((prev) => [...prev, { ...newData, id: crypto.randomUUID() }]);
  };

  //지울 때는 id만 찾아서 지워주면 됨.
  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateSchedule = (newData: ScheduleItem) => {
    //중복 검사
    const isDuplicate = schedules.some(
      (schedule) =>
        schedule.id !== newData.id &&
        schedule.date === newData.date &&
        schedule.startTime === newData.startTime &&
        schedule.endTime === newData.endTime
    );

    if (isDuplicate) {
      showToast.error('이미 등록된 시간대입니다.');
      return;
    }
    setSchedules((prev) => prev.map((item) => (item.id === newData.id ? newData : item)));
  };

  return (
    <div className="flex flex-col gap-4.5">
      <label className="font-bold">예약 가능한 시간대</label>
      <CreateTimeSlotForm onAddSchedule={handleAddSchedule} />
      {schedules.length > 0 && <hr className="text-border-default w-full md:w-[calc(100%+35px)]" />}
      {schedules.map((schedule) => (
        <AddedTimeSlotForm
          key={schedule.id}
          data={schedule}
          onUpdateSchedule={handleUpdateSchedule}
          onDeleteSchedule={handleDeleteSchedule}
        />
      ))}
    </div>
  );
}
