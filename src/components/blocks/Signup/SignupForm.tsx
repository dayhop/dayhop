'use client';
import { useState } from 'react';
import { Button } from '../../ui/Button';
import { postSignUp } from '@/lib/api/users';
import { AuthForm } from '../AuthForm/AuthForm';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/vaildate';

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });

  const [isError, setIsError] = useState({
    email: false,
    name: false,
    password: false,
    passwordConfirm: false,
  });

  const [errorMessage, setErrorMessage] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });

  const handleFocusout = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.id, e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validateField = (id: string, value: string) => {
    let errorMessage = '';

    switch (id) {
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'name':
        errorMessage = validateName(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        if (formData.passwordConfirm) {
          const confirmErrorMsg = validatePasswordConfirm(value, formData.passwordConfirm);
          setIsError((prev) => ({ ...prev, passwordConfirm: !!confirmErrorMsg }));
          setErrorMessage((prev) => ({ ...prev, passwordConfirm: confirmErrorMsg }));
        }
        break;
      case 'passwordConfirm':
        errorMessage = validatePasswordConfirm(value, formData.password);
        break;
      default:
        break;
    }

    setErrorMessage((prev) => ({
      ...prev,
      [id]: errorMessage,
    }));

    setIsError((prev) => ({ ...prev, [id]: errorMessage !== '' }));
  };

  const handleformSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestBody = {
      email: formData.email,
      nickname: formData.name,
      password: formData.password,
    };
    try {
      const res = await postSignUp(requestBody);

      return res;
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  return (
    <form className="flex w-full max-w-140 flex-col gap-5" onSubmit={handleformSubmit}>
      <AuthForm
        title="이메일"
        errorMessage={errorMessage.email}
        isError={isError.email}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="이메일을 입력해 주세요"
        label="email"
      />
      <AuthForm
        title="닉네임"
        errorMessage={errorMessage.name}
        isError={isError.name}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="닉네임을 입력해 주세요"
        label="name"
      />
      <AuthForm
        title="비밀번호 확인"
        type="password"
        errorMessage={errorMessage.password}
        isError={isError.password}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="8자 이상 입력해 주세요"
        label="password"
      />
      <AuthForm
        title="비밀번호 확인"
        type="password"
        errorMessage={errorMessage.passwordConfirm}
        isError={isError.passwordConfirm}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="비밀번호를 한 번 더 입력해 주세요"
        label="passwordConfirm"
      />
      <Button
        type="submit"
        disabled={
          isError['email'] ||
          isError['name'] ||
          isError['password'] ||
          isError['passwordConfirm'] ||
          formData.email === '' ||
          formData.name === '' ||
          formData.password === '' ||
          formData.passwordConfirm === ''
        }
      >
        회원가입하기
      </Button>
    </form>
  );
}
