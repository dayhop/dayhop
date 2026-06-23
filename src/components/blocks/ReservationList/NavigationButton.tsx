'use client';

import { useEffect, useRef } from 'react';

export type ReservationFilterButton =
  | 'pending'
  | 'confirmed'
  | 'declined'
  | 'canceled'
  | 'completed'
  | 'all';

const buttonList: ReservationFilterButton[] = [
  'all',
  'pending',
  'confirmed',
  'declined',
  'canceled',
  'completed',
];

const BUTTON_MATCH: Record<ReservationFilterButton, string> = {
  all: '전체',
  pending: '예약 완료',
  canceled: '예약 취소',
  confirmed: '예약 승인',
  declined: '예약 거절',
  completed: '체험 완료',
};

interface NavigationButtonProps {
  activeStatus: ReservationFilterButton;
  onClickButton: (button: ReservationFilterButton) => void;
}

export function NavigationButton({ activeStatus, onClickButton }: NavigationButtonProps) {
  const buttonRefs = useRef<Map<ReservationFilterButton, HTMLButtonElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buttonRefs.current
      .get(activeStatus)
      ?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
  }, [activeStatus]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
      e.preventDefault();
    };
    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = '';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX);
    };

    el.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex scrollbar-none gap-2 overflow-scroll px-6 [-ms-overflow-style:none] md:px-0"
    >
      {buttonList.map((button) => (
        <button
          type="button"
          key={button}
          ref={(el) => {
            if (el) buttonRefs.current.set(button, el);
            else buttonRefs.current.delete(button);
          }}
          className={`${activeStatus === button ? 'bg-text-primary text-bg' : 'text-text-primary bg-bg'} border-bg-surface h-10 w-23 shrink-0 cursor-pointer rounded-4xl border`}
          onClick={() => onClickButton(button)}
        >
          {BUTTON_MATCH[button]}
        </button>
      ))}
    </div>
  );
}
