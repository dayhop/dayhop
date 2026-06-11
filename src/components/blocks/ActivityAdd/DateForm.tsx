'use client';

import { useState } from 'react';
import { CreateTimeSlotForm } from './CreateTimeSlotForm';
import { AddedTimeSlotForm } from './AddedTimeSlotForm';
import { ActivityScheduleInput } from '@/types/api';

export function DateForm() {
  const [dateFormData, setDateFormData] = useState<ActivityScheduleInput[]>([]);

  return (
    <div className="flex flex-col gap-4.5">
      <label className="font-bold">예약 가능한 시간대</label>
      <CreateTimeSlotForm setDateFormData={setDateFormData} />

      {dateFormData.map((data) => {
        return (
          <AddedTimeSlotForm
            key={`${data.date}-${data.startTime}-${data.endTime}`}
            data={data}
            setDateFormData={setDateFormData}
          />
        );
      })}
    </div>
  );
}
