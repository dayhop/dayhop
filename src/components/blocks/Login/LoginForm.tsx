'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import instance from '@/lib/api/instance';
import Input from '@/components/ui/Input';
import { saveToken } from '@/actions/auth';
import { useRouter } from 'next/navigation';

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
    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = '올바른 이메일 형식이 아닙니다.';
        setIsError((prev) => ({ ...prev, email: true }));
      } else {
        setIsError((prev) => ({ ...prev, email: false }));
      }
    }
    if (id === 'password') {
      if (value.length < 8) {
        errorMessage = '비밀번호는 8자 이상이어야 합니다.';
        setIsError((prev) => ({ ...prev, password: true }));
      } else {
        setIsError((prev) => ({ ...prev, password: false }));
      }
    }
    setErrorMessage((prev) => ({
      ...prev,
      [id]: errorMessage,
    }));
    console.log(errorMessage);
  };

  const handleFocusout = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.id, e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClickButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await postLogin(formData);
      saveToken(res.accessToken, res.refreshToken);
      console.log(res);
    } catch (e) {
      console.error(`로그인 실패${e}`);
    }
  };

  // ============= 삭제해야할 부분 =====================
  interface LoginRequest {
    email: string;
    password: string;
  }
  interface User {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  }
  interface LoginResponse {
    user: User;
    refreshToken: string;
    accessToken: string;
  }
  const postLogin = async (body: LoginRequest): Promise<LoginResponse> => {
    const { data } = await instance.post<LoginResponse>('/auth/login', body);

    return data;
  };
  // =================================================

  return (
    <div className="flex w-full max-w-140 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
          이메일
        </label>
        <Input
          id="email"
          warningText={errorMessage.email}
          isWarning={isError.email}
          placeholder="이메일을 입력해 주세요."
          onBlur={handleFocusout}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
          비밀번호
        </label>
        <Input
          type="password"
          id="password"
          warningText={errorMessage.password}
          onBlur={handleFocusout}
          isWarning={isError.password}
          placeholder="비밀번호를 입력해주세요."
          onChange={handleChange}
        />
      </div>
      <Button disabled={isError.email || isError.password} onClick={handleClickButton}>
        로그인하기
      </Button>
    </div>
  );
}
