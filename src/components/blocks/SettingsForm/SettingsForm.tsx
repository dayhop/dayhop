'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { patchMyUser } from '@/lib/api/users';
import { postLogin } from '@/lib/api/auth';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PasswordConfirmModal } from '../PasswordConfirmModal';
import { showToast } from '@/utils/toast';
import { generateRandomNickname } from '@/utils/randomNickname';
import DiceIcon from '@/assets/icon/DiceIcon.svg';

const INITIAL_FORM = { nickname: '', newPassword: '', confirmPassword: '' };
const INITIAL_ERRORS = { nickname: '', newPassword: '', confirmPassword: '' };

const FormField = ({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2.5">
    <label htmlFor={htmlFor} className="text-text-primary text-base font-medium">
      {label}
    </label>
    {children}
  </div>
);

interface SettingsFormProps {
  isOAuth?: boolean;
}

export const SettingsForm = ({ isOAuth = false }: SettingsFormProps) => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  if (!user) return null;

  const handleChange =
    (field: keyof typeof INITIAL_FORM) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const getNicknameError = () => {
    if (!formData.nickname.trim()) return '닉네임을 입력해주세요.';
    if (formData.nickname.length > 10) return '10자 이하로 작성해주세요.';
    return '';
  };

  const getPasswordError = () => {
    if (!formData.newPassword) return '';
    if (formData.newPassword.length < 8) return '8자 이상 입력해주세요.';
    return '';
  };

  const getConfirmPasswordError = () =>
    formData.newPassword !== formData.confirmPassword ? '비밀번호가 일치하지 않습니다.' : '';

  const handleEditStart = () => {
    if (isOAuth) {
      setFormData({ ...INITIAL_FORM, nickname: user.nickname });
      setIsEditMode(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  // 비밀번호 인증 성공 → 수정 모드 전환
  const handlePasswordConfirm = async (password: string) => {
    const res = await postLogin({ email: user.email, password });
    if (!res.success) {
      throw new Error(res.message);
    }
    setFormData({ ...INITIAL_FORM, nickname: user.nickname });
    setIsEditMode(true);
    setIsPasswordModalOpen(false);
  };

  const handleEditCancel = () => {
    setFormData(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setIsEditMode(false);
  };

  const handleNicknameBlur = () => {
    setErrors((prev) => ({ ...prev, nickname: getNicknameError() }));
  };

  const handleNewPasswordBlur = () => {
    setErrors((prev) => ({
      ...prev,
      newPassword: getPasswordError(),
      confirmPassword: formData.confirmPassword ? getConfirmPasswordError() : prev.confirmPassword,
    }));
  };

  const handleConfirmPasswordBlur = () => {
    setErrors((prev) => ({ ...prev, confirmPassword: getConfirmPasswordError() }));
  };

  // 저장하기 → 바로 저장 (비밀번호 재확인 없음)
  const handleSaveClick = async () => {
    const newErrors = {
      nickname: getNicknameError(),
      newPassword: getPasswordError(),
      confirmPassword: getConfirmPasswordError(),
    };
    setErrors(newErrors);
    if (newErrors.nickname || newErrors.newPassword || newErrors.confirmPassword) return;

    try {
      const res = await patchMyUser({
        nickname: formData.nickname || undefined,
        newPassword: formData.newPassword || undefined,
      });
      if (!res.success) {
        showToast.error(res.message);
        return;
      }
      login(res.data);
      setIsEditMode(false);
      setFormData(INITIAL_FORM);
      showToast.success('수정되었습니다.');
    } catch {
      showToast.error('수정에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FormField label="닉네임" htmlFor="nickname">
        <Input
          id="nickname"
          value={isEditMode ? formData.nickname : user.nickname}
          disabled={!isEditMode}
          isWarning={!!errors.nickname}
          warningText={errors.nickname}
          onChange={handleChange('nickname')}
          onBlur={handleNicknameBlur}
          suffix={
            isEditMode ? (
              <button
                type="button"
                className="text-text-placeholder hover:text-primary shrink-0 cursor-pointer transition-colors"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, nickname: generateRandomNickname() }));
                  setErrors((prev) => ({ ...prev, nickname: '' }));
                }}
                aria-label="랜덤 닉네임 생성"
              >
                <DiceIcon className="h-6 w-6" />
              </button>
            ) : undefined
          }
        />
      </FormField>

      <FormField label="이메일" htmlFor="email">
        <Input id="email" value={user.email} disabled />
      </FormField>

      <FormField label="새 비밀번호" htmlFor="newPassword">
        <Input
          id="newPassword"
          type="password"
          placeholder="새 비밀번호를 입력해 주세요"
          value={formData.newPassword}
          disabled={!isEditMode || isOAuth}
          isWarning={!!errors.newPassword}
          warningText={errors.newPassword}
          onChange={handleChange('newPassword')}
          onBlur={handleNewPasswordBlur}
        />
      </FormField>

      <FormField label="비밀번호 확인" htmlFor="confirmPassword">
        <Input
          id="confirmPassword"
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          value={formData.confirmPassword}
          disabled={!isEditMode || isOAuth}
          isWarning={!!errors.confirmPassword}
          warningText={errors.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleConfirmPasswordBlur}
        />
      </FormField>

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

      {!isOAuth && (
        <PasswordConfirmModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onConfirm={handlePasswordConfirm}
        />
      )}
    </div>
  );
};
