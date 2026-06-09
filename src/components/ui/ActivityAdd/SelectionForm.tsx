'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../Button';

import ArrowDown from '@/assets/icon/ArrowDown.svg';

interface SelectionFormProps {
  label?: string;
  onSelectOption: (option: string) => void;
  defaultMessage?: string;
  list: string[];
  selectedOption?: string;
}

export function SelectionForm({
  label,
  onSelectOption,
  defaultMessage,
  list,
  selectedOption,
}: SelectionFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const displayedMessage = selectedOption || defaultMessage;
  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleClickDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!dropDownRef.current) return;

      if (!dropDownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropDownRef} className="flex flex-col gap-2.5 font-bold">
      <div>{label}</div>
      <button onClick={handleClickDropdown} type="button" className="cursor-pointer">
        <div className="relative flex flex-col gap-3">
          <div className="border-border-default flex h-13 w-full items-center justify-between gap-3 rounded-2xl border bg-white px-5">
            <span
              className={`${displayedMessage === defaultMessage ? 'text-text-placeholder' : 'text-text-primary'} cursor-default font-medium`}
            >
              {displayedMessage}
            </span>
            <ArrowDown />
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="border-border-default relative flex flex-col gap-1 rounded-2xl border bg-white p-3">
          {list.map((item) => {
            return (
              <Button
                onClick={() => {
                  onSelectOption(item);
                  setIsOpen(false);
                }}
                key={item}
                variant="text"
                className={`text-text-primary h-12 rounded-xl px-5 shadow-[0_2px_6px_0_rgba(0,0,0,0.02)] ${displayedMessage === item && 'bg-[#f2f9ff]'}`}
              >
                {item}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
