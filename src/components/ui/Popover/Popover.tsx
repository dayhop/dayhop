'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

import KebabIcon from '@/assets/icon/KebabIcon.svg';
import { cn } from '@/utils/cn';

interface PopoverContextValue {
  isOpen: boolean;
  close: () => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export interface PopoverProps {
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  ariaLabel?: string;
}

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
}

const PopoverContent = ({ children, className }: PopoverContentProps) => {
  return (
    <div role="dialog" className={cn('absolute z-50 bg-white', className)}>
      {children}
    </div>
  );
};

type PopoverComponent = {
  (props: PopoverProps): ReactElement;
  Content: typeof PopoverContent;
};

export const Popover: PopoverComponent = ({
  trigger,
  children,
  className,
  triggerClassName,
  ariaLabel = '메뉴 열기',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!popoverRef.current) return;

      if (!popoverRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <PopoverContext.Provider value={{ isOpen, close }}>
      <div ref={popoverRef} className={cn('relative inline-flex', className)}>
        <button
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={cn('cursor-pointer', triggerClassName)}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {trigger ?? <KebabIcon aria-hidden="true" />}
        </button>

        {isOpen && children}
      </div>
    </PopoverContext.Provider>
  );
};

Popover.Content = PopoverContent;

export const usePopover = () => {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error('usePopover는 Popover 내부에서만 사용할 수 있습니다.');
  }

  return context;
};
