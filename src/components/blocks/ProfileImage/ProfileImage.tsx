'use client';

import { useState } from 'react';
import { Popover, usePopover } from '@/components/ui/Popover';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Avatar } from '@/components/ui/Avatar';
import EditIcon2 from '@/assets/icon/EditIcon2.svg';
import EditIcon from '@/assets/icon/EditIcon.svg';
import DeleteIcon from '@/assets/icon/DeleteIcon.svg';

interface ProfileMenuProps {
  onDeleteClick: () => void;
}

const ProfileMenu = ({ onDeleteClick }: ProfileMenuProps) => {
  const { close } = usePopover();

  return (
    <Popover.Content className="top-[calc(100%+5px)] rounded-xl border border-gray-200 bg-white p-2 shadow-md md:top-auto md:bottom-0 md:left-[calc(100%+15px)]">
      <button
        type="button"
        className="relative flex cursor-pointer items-center gap-2.25 rounded-md px-3 py-2.5 text-base font-medium whitespace-nowrap text-gray-700 transition-colors hover:bg-[rgba(237,238,242,0.5)]"
        onClick={close}
      >
        <EditIcon />
        수정하기
      </button>
      <button
        type="button"
        className="relative flex cursor-pointer items-center gap-2.25 rounded-md px-3 py-2.5 text-base font-medium whitespace-nowrap text-red-500 transition-colors hover:bg-[rgba(229,72,77,0.1)]"
        onClick={() => {
          close();
          onDeleteClick();
        }}
      >
        <DeleteIcon />
        삭제하기
      </button>
    </Popover.Content>
  );
};

export const ProfileImage = () => {
  const triggerEl = (
    <div className="relative">
      <Avatar size="lg" />
      <EditIcon2 className="absolute right-0 bottom-0 md:h-6 md:w-6 lg:h-7.5 lg:w-7.5" />
    </div>
  );

  return (
    <div>
      <Popover trigger={triggerEl} ariaLabel="메뉴 열기">
        <ProfileMenu onDeleteClick={() => {}} />
      </Popover>
    </div>
  );
};
