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
  return <></>;
};
