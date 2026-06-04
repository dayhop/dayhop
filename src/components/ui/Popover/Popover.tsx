'use client';

import { useEffect, useRef, useState, createContext, useContext } from 'react';
import { cn } from '@/utils/cn';
import KebabIcon from '@/assets/icon/KebabIcon.svg';

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const PopoverContext = createContext<PopoverContextType | null>(null);

export interface PopoverProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  menuClassName?: string;
}

export const Popover = ({ trigger, children, menuClassName }: PopoverProps) => {
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
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
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
            className={cn(
              'absolute top-0 right-full flex flex-col rounded-lg border border-[#DFDFDF] bg-white px-2.5 py-3 text-center whitespace-nowrap',
              menuClassName
            )}
          >
            {children}
          </div>
        )}
      </div>
    </PopoverContext.Provider>
  );
};

interface PopoverItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'delete';
}

export const PopoverItem = ({ children, onClick, icon, variant = 'default' }: PopoverItemProps) => {
  const context = useContext(PopoverContext);

  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'relative flex cursor-pointer items-center gap-2.25 rounded-md px-3 py-2.5 text-base font-medium transition-colors',
        variant === 'delete'
          ? 'text-[#E5484D] hover:bg-[rgba(229,72,77,0.1)]'
          : 'text-gray-700 hover:bg-[rgba(237,238,242,0.5)]'
      )}
      onClick={() => {
        onClick?.();
        context?.setIsOpen(false);
      }}
    >
      {icon}
      {children}
    </button>
  );
};
