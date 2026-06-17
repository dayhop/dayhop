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

  return <></>;
};
