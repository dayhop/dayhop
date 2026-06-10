'use client';

import { Dispatch, SetStateAction, useState } from 'react';

interface FormDataType {
  date: string;
  time: string;
}

interface DateFiledProp {
  data?: string;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
}
export function DateField({ data, setFormData }: DateFiledProp) {
  const [inputType, setInputType] = useState<'text' | 'date'>('text');
  return (
    <div className="flex flex-col gap-2.5">
      <label className="font-bold" htmlFor="activityDate">
        날짜
      </label>
      <input
        id="activityDate"
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
        className="border-bg-footer text-text-primary w-full min-w-81 rounded-2xl border bg-white px-5 py-4 transition-all outline-none focus:bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer hover:[&::-webkit-calendar-picker-indicator]:opacity-80"
      />
    </div>
  );
}
