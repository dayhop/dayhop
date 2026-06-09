'use client';

import { useState } from 'react';

export function DateField() {
  const [inputType, setInputType] = useState('text');
  return (
    <div className="flex flex-col gap-2.5">
      <label className="font-bold" id="aactivityDate">
        날짜
      </label>
      <input
        id="activityDate"
        type={inputType}
        placeholder="yy/mm/dd"
        onFocus={() => setInputType('date')}
        className="box-border w-full min-w-81 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 transition-all outline-none focus:bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
      />
    </div>
  );
}
