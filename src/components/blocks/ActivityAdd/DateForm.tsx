'use client';

import { useState, useImperativeHandle, type Ref } from 'react';
import { CreateTimeSlotForm } from './CreateTimeSlotForm';
import { AddedTimeSlotForm } from './AddedTimeSlotForm';
import { ActivityScheduleInput } from '@/types/api';

export interface DateFormRef {
  getValues: () => ActivityScheduleInput[];
}

export interface ScheduleItem extends ActivityScheduleInput {
  id: string;
}

export function DateForm({ ref }: { ref?: Ref<DateFormRef> }) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  useImperativeHandle(ref, () => ({
    getValues: () => schedules.map(({ id, ...rest }) => rest),
  }));

  const handleAddSchedule = (newData: ActivityScheduleInput) => {
    setSchedules((prev) => [...prev, { ...newData, id: crypto.randomUUID() }]);
  };

  //지울 때는 id만 찾아서 지워주면 됨.
  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateSchedule = (newData: ScheduleItem) => {
    setSchedules((prev) => prev.map((item) => (item.id === newData.id ? newData : item)));
  };

  return (
    <div className="flex flex-col gap-4.5">
      <label className="font-bold">예약 가능한 시간대</label>
      <CreateTimeSlotForm onAddSchedule={handleAddSchedule} />

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
