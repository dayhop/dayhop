'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { AuthField } from '../../AuthField/AuthField';

import { useAuthStore } from '@/store/useAuthStore';
import { postLogin } from '@/lib/api/auth';
import { showToast } from '@/utils/toast';
import { validateEmail, validatePassword } from '@/utils/validate';

export function LoginForm() {
  const router = useRouter();

  const { login } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (id: string, value: string) => {
    if (!id) return;
    let errorMessage = '';
    switch (id) {
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      default:
        break;
    }
    setErrorMessage((prev) => ({
      ...prev,
      [id]: errorMessage,
    }));
  };

  const handleFocusout = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.id, e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const res = await postLogin(formData);
    if (!res.success) {
      showToast.error(res.message);
      setIsSubmitting(false);
      return;
    }
    showToast.success(`${res.data.user?.nickname}님 반갑습니다.`);
    router.push('/');
    login(res.data.user);
  };

  return (
    <form className="flex w-full max-w-140 flex-col gap-5" onSubmit={handleSubmit}>
      <AuthField
        title="이메일"
        errorMessage={errorMessage.email}
        isError={!!errorMessage.email}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="이메일을 입력해 주세요"
        label="email"
      />
      <AuthField
        title="비밀번호"
        errorMessage={errorMessage.password}
        isError={!!errorMessage.password}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="비밀번호를 입력해 주세요"
        type="password"
        label="password"
      />
      <Button
        disabled={
          !!errorMessage.email || !!errorMessage.password || !formData.email || !formData.password
        }
        isLoading={isSubmitting}
        type="submit"
      >
        로그인하기
      </Button>
    </form>
  );
}
