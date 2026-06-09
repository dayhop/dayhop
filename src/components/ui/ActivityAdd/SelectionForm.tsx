'use client';

import { useState } from 'react';
import { Button } from '../Button';

import ArrowDown from '@/assets/icon/ArrowDown.svg';

interface SelectionFormProps {
  label: string;
  onSelectCategory: (option: string) => void;
  defaultMessage?: string;
  list: string[];
  selectOption?: string;
}

export function SelectionForm({
  label,
  onSelectCategory,
  defaultMessage,
  list,
  selectOption,
}: SelectionFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>(defaultMessage || selectOption || '');

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col gap-2.5 font-bold">
      <div>{label}</div>
      <div className="relative flex flex-col gap-3">
        <div className="flex h-13 w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4">
          <span
            className={`${showMessage === defaultMessage ? 'text-gray-400' : 'text-black'} cursor-default`}
          >
            {showMessage}
          </span>
          <button onClick={handleClick} className="cursor-pointer">
            <ArrowDown />
          </button>
        </div>

        {isOpen && (
          <div className="relative flex flex-col gap-2 rounded-2xl border border-[#E0E0E5] md:absolute md:top-full md:z-10 md:mt-2 md:w-full">
            {list.map((item) => {
              return (
                <Button
                  onClick={() => {
                    onSelectCategory(item);
                    setIsOpen(false);
                    setShowMessage(item);
                  }}
                  key={item}
                  variant="text"
                  className="text-black"
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
