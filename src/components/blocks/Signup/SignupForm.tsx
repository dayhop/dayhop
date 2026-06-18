'use client';
import { useState } from 'react';

import { Button } from '../../ui/Button';
import { postSignUp } from '@/lib/api/users';

import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validate';
import { AuthField } from '../AuthField/AuthField';
import { showToast } from '@/utils/toast';
import { handleRandomNickname } from '@/utils/randomNickname';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
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
    if (!value || !id) return;
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
      showToast.success('회원가입에 성공했습니다.');
      router.push('/');
      return res;
    } catch {}
  };

  return (
    <form className="flex w-full max-w-140 flex-col gap-5" onSubmit={handleformSubmit}>
      <AuthField
        title="이메일"
        errorMessage={errorMessage.email}
        isError={!!errorMessage.email}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="이메일을 입력해 주세요"
        label="email"
      />
      <div className="flex items-end gap-2">
        <AuthField
          title="닉네임"
          errorMessage={errorMessage.name}
          isError={!!errorMessage.name}
          handleChange={handleChange}
          handleFocusout={handleFocusout}
          placeholder="닉네임을 입력해 주세요"
          label="name"
          value={formData.name}
          className="w-180"
        />
        <Button
          className="mt-7 w-40 p-0 text-sm"
          onClick={() => handleRandomNickname(handleChange)}
        >
          랜덤 닉네임
        </Button>
      </div>

      <AuthField
        title="비밀번호"
        type="password"
        errorMessage={errorMessage.password}
        isError={!!errorMessage.password}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="8자 이상 입력해 주세요"
        label="password"
      />
      <AuthField
        title="비밀번호 확인"
        type="password"
        errorMessage={errorMessage.passwordConfirm}
        isError={!!errorMessage.passwordConfirm}
        handleChange={handleChange}
        handleFocusout={handleFocusout}
        placeholder="비밀번호를 한 번 더 입력해 주세요"
        label="passwordConfirm"
      />
      <Button
        type="submit"
        disabled={
          !!errorMessage.email ||
          !!errorMessage.name ||
          !!errorMessage.password ||
          !!errorMessage.passwordConfirm ||
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
