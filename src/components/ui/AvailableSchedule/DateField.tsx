'use client';

import { ActivityScheduleInput } from '@/types/api';
import { Dispatch, SetStateAction, useId, useState } from 'react';

interface DateFieldProp {
  data: string;
  setFormData: Dispatch<SetStateAction<ActivityScheduleInput>>;
  isLabel?: boolean;
}
export function DateField({ data, setFormData, isLabel = true }: DateFieldProp) {
  const [inputType, setInputType] = useState<'text' | 'date'>('text');
  const uniqueId = useId();
  return (
    <div className="flex w-full flex-col gap-2.5">
      <label className={`${isLabel ? '' : 'hidden'} font-bold`} htmlFor={uniqueId}>
        날짜
      </label>
      <input
        id={uniqueId}
        value={data}
        type={data ? 'date' : inputType}
        placeholder="yyyy/mm/dd"
        onFocus={() => setInputType('date')}
        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
        onBlur={(e) => {
          if (!e.target.value) {
            setInputType('text');
          }
        }}
        className="border-bg-footer text-text-primary focus-within:border-text-primary w-full min-w-81 rounded-2xl border bg-white px-4 py-3 transition-all outline-none focus:bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer hover:[&::-webkit-calendar-picker-indicator]:opacity-80"
      />
    </div>
  );
}
