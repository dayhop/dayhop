'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../Button';

import ArrowDown from '@/assets/icon/ArrowDown.svg';

interface SelectFieldProps {
  label?: string;
  onSelectOption: (option: string) => void;
  defaultMessage?: string;
  list: string[];
  selectedOption?: string;
  isLabelReaction?: boolean;
  disabled?: boolean;
}

export function SelectField({
  label,
  onSelectOption,
  defaultMessage,
  list,
  selectedOption,
  isLabelReaction = false,
  disabled = false,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const displayedMessage = selectedOption || defaultMessage;
  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleClickDropdown = () => {
    if (disabled) return;
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
    <div ref={dropDownRef} className="relative flex w-full flex-col gap-2.5 font-bold">
      {label && <div className={`${isLabelReaction ? 'hidden md:flex' : ''}`}>{label}</div>}
      <div className="relative w-full shadow-[0_2px_6px_0_rgba(0,0,0,0.02)]">
        <button
          onClick={handleClickDropdown}
          type="button"
          disabled={disabled}
          className={`border-border-default flex h-13 w-full min-w-29 items-center justify-between gap-3 rounded-2xl border bg-white px-5 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <span
            className={`${displayedMessage === defaultMessage ? 'text-text-placeholder' : 'text-text-primary'} font-medium`}
          >
            {displayedMessage}
          </span>
          <ArrowDown />
        </button>
        {isOpen && (
          <div className="border-border-default absolute z-50 mt-2 flex max-h-64 w-full flex-col gap-1 overflow-y-auto rounded-2xl border bg-white p-3 shadow-[0_2px_6px_0_rgba(0,0,0,0.02)]">
            {list.map((item) => {
              return (
                <Button
                  onClick={() => {
                    onSelectOption(item);
                    setIsOpen(false);
                  }}
                  key={item}
                  variant="text"
                  className={`text-text-primary h-12 shrink-0 rounded-xl px-5 shadow-[0_2px_6px_0_rgba(0,0,0,0.02)] ${displayedMessage === item && 'bg-[#f2f9ff]'}`}
                >
                  {item}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
