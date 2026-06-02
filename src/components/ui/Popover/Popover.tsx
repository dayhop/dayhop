'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import KebabIcon from '@/assets/icon/KebabIcon.svg';

type PopoverItem = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'delete';
};
export interface PopoverProps {
  trigger?: React.ReactNode;
  items: PopoverItem[];
}

export const Popover = ({ trigger, items }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!popoverRef.current) return;

      if (!popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={popoverRef} className="relative inline-flex">
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {trigger ?? <KebabIcon aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-0 right-full flex flex-col rounded-lg border border-[#DFDFDF] bg-white px-2.5 py-3 text-center whitespace-nowrap"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={cn(
                'relative flex cursor-pointer items-center gap-2.25 rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                item.variant === 'delete'
                  ? 'text-[#E5484D] hover:bg-[rgba(229,72,77,0.1)]'
                  : 'text-gray-700 hover:bg-[rgba(237,238,242,0.5)]'
              )}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
