'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface PasswordConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
}

export const PasswordConfirmModal = ({ isOpen, onClose, onConfirm }: PasswordConfirmModalProps) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setPassword('');
    setErrorMessage('');
    onClose();
  };

  const handleConfirm = async () => {
    if (!password) return;
    setIsLoading(true);
    try {
      await onConfirm(password);
      setPassword('');
      setErrorMessage('');
    } catch {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      onClose={handleClose}
      className="w-[320px] max-w-[calc(100vw-32px)] px-4 py-8 md:w-100 md:p-8"
    >
      <h2 className="mb-2.5 text-lg font-bold">비밀번호 확인</h2>
      <Input
        type="password"
        placeholder="현재 비밀번호를 입력해 주세요"
        value={password}
        isWarning={!!errorMessage}
        warningText={errorMessage}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrorMessage('');
        }}
      />

      <div className="mt-5 flex gap-2">
        <Button variant="secondary" size="md" className="flex-1" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="primary"
          size="md"
          className="flex-1"
          disabled={!password || isLoading}
          onClick={handleConfirm}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
};
