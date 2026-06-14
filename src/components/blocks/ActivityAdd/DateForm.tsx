'use client';

import { useRef, useState, useImperativeHandle, type Ref } from 'react';
import { CreateTimeSlotForm } from './CreateTimeSlotForm';
import { AddedTimeSlotForm, TimeSlotFormRef } from './AddedTimeSlotForm';
import { ActivityScheduleInput } from '@/types/api';

export interface DateFormRef {
  getValues: () => ActivityScheduleInput[];
}

export function DateForm({ ref }: { ref?: Ref<DateFormRef> }) {
  const [dateFormData, setDateFormData] = useState<ActivityScheduleInput[]>([]);

  const addedFormsRefs = useRef<(TimeSlotFormRef | null)[]>([]);

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return dateFormData
        .map((_, index) => {
          const formRef = addedFormsRefs.current[index];
          return formRef ? formRef.getValues() : null;
        })
        .filter((data): data is ActivityScheduleInput => data !== null);
    },
  }));

  return (
    <div className="flex flex-col gap-4.5">
      <label className="font-bold">예약 가능한 시간대</label>
      <CreateTimeSlotForm setDateFormData={setDateFormData} />

      {dateFormData.map((data, index) => {
        const key = crypto.randomUUID();

        return (
          <AddedTimeSlotForm
            key={key}
            data={data}
            setDateFormData={setDateFormData}
            ref={(el) => {
              addedFormsRefs.current[index] = el;
            }}
          />
        );
      })}
    </div>
  );
}
