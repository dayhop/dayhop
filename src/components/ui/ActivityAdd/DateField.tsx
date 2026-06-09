'use client';

import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import CalendarIcon from '@/assets/icon/CalendarIcon.svg';
import 'react-datepicker/dist/react-datepicker.css';

export function DateField() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <DatePicker
      selected={date}
      customInput={<CustomDateInput />}
      shouldCloseOnSelect
      disabledKeyboardNavigation
      onChange={(date: Date | null) => setDate(date)}
      dateFormat="yy-MM-dd"
    />
  );
}

interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, onChange }, ref) => {
    // 3. 숫자만 추출해서 yy-MM-dd 형태로 하이픈을 자동 삽입하는 로직
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
      if (rawValue.length > 6) rawValue = rawValue.slice(0, 6); // 최대 6자리(yyMMdd)로 제한

      let formattedValue = rawValue;
      if (rawValue.length >= 5) {
        formattedValue = `${rawValue.slice(0, 2)}-${rawValue.slice(2, 4)}-${rawValue.slice(4)}`;
      } else if (rawValue.length >= 3) {
        formattedValue = `${rawValue.slice(0, 2)}-${rawValue.slice(2)}`;
      }

      e.target.value = formattedValue;
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <>
        <div className="relative flex h-13 w-full min-w-80 items-center">
          <input
            type="text"
            value={value}
            onClick={onClick}
            onChange={handleInputChange}
            ref={ref}
            placeholder="yy-mm-dd"
            className="h-full w-full rounded-2xl border border-gray-400 px-3 py-4 pr-12 text-black focus:border-black focus:outline-none"
          />

          <CalendarIcon className="pointer-events-none absolute right-4 cursor-pointer text-black" />
        </div>
      </>
    );
  }
);

CustomDateInput.displayName = 'CustomDateInput';
