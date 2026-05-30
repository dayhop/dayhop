'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

// TODO: cn 유틸 머지 후 className 병합 방식 변경
export const Modal = ({ children, className = '', onClose }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`rounded-2xl bg-white p-6 shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
