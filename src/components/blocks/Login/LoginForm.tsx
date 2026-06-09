'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { AuthField } from '../AuthField/AuthField';

import { postLogin } from '@/lib/api/auth';
import { validateEmail, validatePassword } from '@/utils/vaildate';

import { saveToken } from '@/actions/auth';

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
  });

  const [isError, setIsError] = useState({
    email: false,
    password: false,
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const validateField = (id: string, value: string) => {
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

    setIsError((prev) => ({
      ...prev,
      [id]: errorMessage !== '',
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
    try {
      const res = await postLogin(formData);
      await saveToken(res.accessToken, res.refreshToken);
      console.log(res);
    } catch (e) {
      console.error(`로그인 실패${e}`);
    }
  };

  return (
    <form className="flex w-full max-w-140 flex-col gap-5" onSubmit={handleSubmit}>
      <AuthField
        title="이메일"
        errorMessage={errorMessage.email}
        isError={isError.email}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="이메일을 입력해 주세요"
        label="email"
      />
      <AuthField
        title="비밀번호"
        errorMessage={errorMessage.password}
        isError={isError.password}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="비밀번호를 입력해 주세요"
        type="password"
        label="password"
      />
      <Button
        disabled={isError.email || isError.password || !formData.email || !formData.password}
        type="submit"
      >
        로그인하기
      </Button>
    </form>
  );
}
