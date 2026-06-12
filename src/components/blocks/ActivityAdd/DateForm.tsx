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
  const addedFormsRefs = useRef<Map<string, TimeSlotFormRef>>(new Map());

  useImperativeHandle(ref, () => ({
    getValues: () => {
      const addedData = dateFormData
        .map((data) => {
          const key = crypto.randomUUID();
          const formRef = addedFormsRefs.current.get(key);
          return formRef ? formRef.getValues() : null;
        })
        .filter((data) => data !== null) as ActivityScheduleInput[];

      return addedData;
    },
  }));

  return (
    <div className="flex flex-col gap-4.5">
      <label className="font-bold">예약 가능한 시간대</label>
      <CreateTimeSlotForm setDateFormData={setDateFormData} />

      {dateFormData.map((data) => {
        const key = crypto.randomUUID();
        return (
          <AddedTimeSlotForm
            key={key}
            data={data}
            setDateFormData={setDateFormData}
            ref={(el) => {
              if (el) {
                addedFormsRefs.current.set(key, el);
              } else {
                addedFormsRefs.current.delete(key);
              }
            }}
          />
        );
      })}
    </div>
  );
}
