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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <label className="text-text-primary text-base font-medium">닉네임</label>
        <Input
          value={isEditMode ? formData.nickname : (user?.nickname ?? '')}
          disabled={!isEditMode}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-text-primary text-base font-medium">이메일</label>
        <Input value={user?.email ?? ''} disabled />
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-text-primary text-base font-medium">새 비밀번호</label>
        <Input
          type="password"
          placeholder="새 비밀번호를 입력해 주세요"
          value={formData.newPassword}
          disabled={!isEditMode}
          isWarning={!!errors.newPassword}
          warningText={errors.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          onBlur={() => {
            if (formData.newPassword && formData.newPassword.length < 8) {
              setErrors((prev) => ({ ...prev, newPassword: '8자 이상 입력해주세요.' }));
            } else {
              setErrors((prev) => ({ ...prev, newPassword: '' }));
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-text-primary text-base font-medium">비밀번호 확인</label>
        <Input
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          value={formData.confirmPassword}
          disabled={!isEditMode}
          isWarning={!!errors.confirmPassword}
          warningText={errors.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          onBlur={() => {
            if (formData.newPassword !== formData.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
            } else {
              setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }
          }}
        />
      </div>

      <div className="flex justify-center gap-2">
        {isEditMode ? (
          <>
            <Button variant="secondary" onClick={handleEditCancel} className="w-32 p-0">
              취소
            </Button>
            <Button variant="primary" onClick={handleSaveClick} className="w-32 p-0">
              저장하기
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={handleEditStart} className="w-32 p-0">
            수정하기
          </Button>
        )}
      </div>

      <PasswordConfirmModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handlePasswordConfirm}
      />
    </div>
  );
};
