'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Popover, usePopover } from '@/components/ui/Popover';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { patchMyUser, postMyUserProfile } from '@/lib/api/users';
import { Avatar } from '@/components/ui/Avatar';
import EditIcon2 from '@/assets/icon/EditIcon2.svg';
import EditIcon from '@/assets/icon/EditIcon.svg';
import DeleteIcon from '@/assets/icon/DeleteIcon.svg';
import { showToast } from '@/utils/toast';

interface ProfileMenuProps {
  onDeleteClick: () => void;
  onEditClick: () => void;
}

interface ProfileImageProps {
  editable?: boolean;
}

const ProfileMenu = ({ onDeleteClick, onEditClick }: ProfileMenuProps) => {
  const { close } = usePopover();

  return (
    <Popover.Content className="top-[calc(100%+5px)] rounded-xl border border-gray-200 bg-white p-2 shadow-md md:top-auto md:bottom-0 md:left-[calc(100%+15px)]">
      <button
        type="button"
        className="relative flex cursor-pointer items-center gap-2.25 rounded-md px-3 py-2.5 text-base font-medium whitespace-nowrap text-gray-700 transition-colors hover:bg-[rgba(237,238,242,0.5)]"
        onClick={() => {
          close();
          onEditClick();
        }}
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

export const ProfileImage = ({ editable = false }: ProfileImageProps) => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConfirmDelete = async () => {
    const res = await patchMyUser({ profileImageUrl: null });
    if (!res.success) {
      showToast.error(res.message);
      setIsConfirmOpen(false);
      return;
    }
    login(res.data);
    setIsConfirmOpen(false);
    showToast.success('프로필 이미지가 삭제되었습니다.');
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleCancelEdit = () => {
    setIsEditConfirmOpen(false);
    setPreviewUrl(null);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmEdit = async () => {
    if (!pendingFile) return;
    const uploadRes = await postMyUserProfile({ image: pendingFile });
    if (!uploadRes.success) {
      showToast.error(uploadRes.message);
      handleCancelEdit();
      return;
    }
    const res = await patchMyUser({ profileImageUrl: uploadRes.data.profileImageUrl });
    if (!res.success) {
      showToast.error(res.message);
      handleCancelEdit();
      return;
    }
    login(res.data);
    setPreviewUrl(null);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsEditConfirmOpen(false);
    showToast.success('프로필 이미지가 변경되었습니다.');
  };

  const triggerEl = (
    <div className="relative">
      <Avatar size="lg" src={previewUrl ?? user?.profileImageUrl ?? undefined} />
      <EditIcon2 className="absolute right-0 bottom-0 h-7.5 w-7.5 md:h-6 md:w-6 lg:h-7.5 lg:w-7.5" />
    </div>
  );

  if (!editable) {
    return <Avatar size="lg" src={user?.profileImageUrl ?? undefined} />;
  }

  return (
    <div>
      <Popover trigger={triggerEl} ariaLabel="메뉴 열기">
        <ProfileMenu
          onDeleteClick={() => {
            if (!user?.profileImageUrl) {
              showToast.error('삭제할 프로필 이미지가 없습니다.');
              return;
            }
            setIsConfirmOpen(true);
          }}
          onEditClick={() => fileInputRef.current?.click()}
        />
      </Popover>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setPendingFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          setIsEditConfirmOpen(true);
        }}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="프로필 이미지를 삭제하시겠습니까?"
      />

      <ConfirmModal
        isOpen={isEditConfirmOpen}
        onClose={handleCancelEdit}
        onConfirm={handleConfirmEdit}
        message="프로필 이미지를 변경하시겠습니까?"
      />
    </div>
  );
};
