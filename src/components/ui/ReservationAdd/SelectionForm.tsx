'use client';

import { useState } from 'react';
import { Button } from '../Button';

const categoryList = ['문화 예술', '식음료', '스포츠', '투어', '관광'];

interface SelectionFormProps {
  onSelectCategory: (category: string) => void;
}

export function SelectionForm({ onSelectCategory }: SelectionFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>('카테고리를 선택해주세요');

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex h-13 w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4">
        <span
          className={`${showMessage === '카테고리를 선택해주세요' ? 'text-gray-400' : 'text-black'}`}
        >
          {showMessage}
        </span>
        <button onClick={handleClick}>V</button>
      </div>

      {isOpen && (
        <div className="relative flex flex-col gap-2 rounded-2xl border border-[#E0E0E5] md:absolute md:top-full md:z-10 md:mt-2 md:w-full">
          {categoryList.map((item) => {
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
  );
}
