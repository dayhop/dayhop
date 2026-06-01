'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface ModalProps {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  ariaLabel?: string;
}

export const Modal = ({ children, className = '', onClose, ariaLabel }: ModalProps) => {
  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn('rounded-2xl bg-white p-6 shadow-lg', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
