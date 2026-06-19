'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { deleteMyActivity } from '@/lib/api/my-activities';
import { showToast } from '@/utils/toast';

interface KebabMenuProps {
  activityId: number;
}

export const KebabMenu = ({ activityId }: KebabMenuProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/activities/${activityId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const res = await deleteMyActivity(activityId);
    if (!res.success) {
      showToast.error(res.message);
      return;
    }
    showToast.success('체험이 성공적으로 삭제되었습니다.');
    setIsConfirmOpen(false);
    router.push('/');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100 focus:outline-none"
        aria-label="더보기"
        aria-expanded={isOpen}
      >
        <svg className="text-text-primary h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-border-default ring-opacity-5 absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-xl border bg-white p-1.5 shadow-md ring-1 ring-black focus:outline-none">
          <button
            type="button"
            onClick={handleEdit}
            className="text-text-secondary hover:bg-gray-25 flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="text-status-danger flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-red-50"
          >
            삭제하기
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        message="정말 삭제하시겠습니까?"
      />
    </div>
  );
};
