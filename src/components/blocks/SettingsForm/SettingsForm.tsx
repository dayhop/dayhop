'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { patchMyUser } from '@/lib/api/users';
import { postLogin } from '@/lib/api/auth';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PasswordConfirmModal } from '../PasswordConfirmModal';
import { showToast } from '@/utils/toast';

export const SettingsForm = () => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleEditStart = () => {
    setFormData({ nickname: user?.nickname ?? '', newPassword: '', confirmPassword: '' });
    setIsEditMode(true);
  };

  const handleEditCancel = () => {
    setFormData({ nickname: '', newPassword: '', confirmPassword: '' });
    setErrors({ newPassword: '', confirmPassword: '' });
    setIsEditMode(false);
  };

  const handleSaveClick = () => {
    const newErrors = { newPassword: '', confirmPassword: '' };

    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = '8자 이상 입력해주세요.';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    if (newErrors.newPassword || newErrors.confirmPassword) return;

    setIsPasswordModalOpen(true);
  };

  const handlePasswordConfirm = async (password: string) => {
    await postLogin({ email: user?.email ?? '', password });
    try {
      const updatedUser = await patchMyUser({
        nickname: formData.nickname || undefined,
        newPassword: formData.newPassword || undefined,
      });
      login(updatedUser);
      setIsPasswordModalOpen(false);
      setIsEditMode(false);
      setFormData({ nickname: '', newPassword: '', confirmPassword: '' });
      showToast.success('수정되었습니다.');
    } catch {
      showToast.error('수정에 실패했습니다.');
      setIsPasswordModalOpen(false);
    }
  };

  return <></>;
};
