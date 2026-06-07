'use client';

import { useState } from 'react';

type ReservationStatus =
  | '전체 조회'
  | '예약 완료'
  | '예약 취소'
  | '예약 승인'
  | '예약 거절'
  | '체험 완료';

export function NavigationButton() {
  const buttonList = ['전체 조회', '예약 완료', '예약 취소', '예약 승인', '예약 거절', '체험 완료'];
  const [activeButton, setActiveButton] = useState<ReservationStatus>('전체 조회');
  const handleClickButton = (button: ReservationStatus) => {
    setActiveButton(() => button);
  };
  return (
    <div className="flex scrollbar-none gap-2 overflow-scroll [-ms-overflow-style:none]">
      {buttonList.map((button) => (
        <button
          key={button}
          value={button}
          className={`${activeButton === button ? 'bg-black text-white' : 'bg-white text-black'} h-10 w-23 shrink-0 cursor-pointer rounded-4xl border border-[#d8d8d8]`}
          onClick={() => handleClickButton(button as ReservationStatus)}
        >
          {button}
        </button>
      ))}
    </div>
  );
}
