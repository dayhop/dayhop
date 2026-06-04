'use client';
import { useState } from 'react';
import { Button } from '../ui/Button';

export function SignupForm() {
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

  //에러 메세지가 모두 빈 문자열이면 버튼 disabled 풀기

  const handleFocusout = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
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

    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = '올바른 이메일 형식이 아닙니다.';
      }
    }

    if (id === 'name') {
      if (id.length > 10) {
        errorMessage = '열 자 이하로 작성해주세요.';
      }
    }

    if (id === 'password') {
      if (value.length < 8) {
        errorMessage = '비밀번호는 8자 이상이어야 합니다.';
      }
    }

    if (id === 'passwordConfirm') {
      if (value !== formData.password) {
        errorMessage = '비밀번호가 일치하지 않습니다.';
      }
    }

    // 에러 상태 업데이트
    setErrorMessage((prev) => ({
      ...prev,
      [id]: errorMessage,
    }));
  };

  return (
    <div className="flex w-full max-w-140 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleFocusout}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700">
          닉네임
        </label>
        <input
          id="name"
          placeholder="이름을 입력해 주세요"
          value={formData.name}
          onBlur={handleFocusout}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={formData.password}
          onBlur={handleFocusout}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="passwordConfirm" className="text-sm font-semibold text-gray-700">
          비밀번호 확인
        </label>
        <input
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          value={formData.passwordConfirm}
          onBlur={handleFocusout}
          onChange={handleChange}
        />
      </div>
      <Button disabled={true}>회원가입하기</Button>
    </div>
  );
}
