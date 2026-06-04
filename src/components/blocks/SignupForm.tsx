'use client';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import Input from '../ui/Input';

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

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const hasNoErrors = Object.values(errorMessage).every((msg) => msg === '');
    const isAllFilled = Object.values(formData).every((val) => val !== '');
    const updateButtonState = () => {
      setIsDisabled(!(hasNoErrors && isAllFilled));
    };
    updateButtonState();
  }, [errorMessage, formData]);

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
        setIsError((prev) => ({
          ...prev,
          email: true,
        }));
      } else {
        setIsError((prev) => ({
          ...prev,
          email: false,
        }));
        console.log(isError);
      }
    }

    if (id === 'name') {
      if (value.length > 10) {
        errorMessage = '열 자 이하로 작성해주세요.';
        setIsError((prev) => ({
          ...prev,
          name: true,
        }));
      } else {
        setIsError((prev) => ({
          ...prev,
          name: false,
        }));
      }
    }

    if (id === 'password') {
      if (value.length < 8) {
        errorMessage = '비밀번호는 8자 이상이어야 합니다.';
        setIsError((prev) => ({
          ...prev,
          password: true,
        }));
        console.log(isError);
      } else {
        setIsError((prev) => ({
          ...prev,
          password: false,
        }));
      }
    }

    if (id === 'passwordConfirm') {
      if (value !== formData.password) {
        errorMessage = '비밀번호가 일치하지 않습니다.';
        setIsError((prev) => ({
          ...prev,
          passwordConfirm: true,
        }));
      } else {
        setIsError((prev) => ({
          ...prev,
          passwordConfirm: false,
        }));
      }
    }

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
        <Input
          id="email"
          warningText={errorMessage.email}
          isWarning={isError.email}
          placeholder="이메일을 입력해 주세요"
          onBlur={handleFocusout}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700">
          닉네임
        </label>
        <Input
          id="name"
          warningText={errorMessage.name}
          onBlur={handleFocusout}
          isWarning={isError.name}
          placeholder="닉네임을 입력해 주세요"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          warningText={errorMessage.password}
          isWarning={isError.password}
          placeholder="비밀번호를 입력해 주세요"
          onBlur={handleFocusout}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="passwordConfirm" className="text-sm font-semibold text-gray-700">
          비밀번호 확인
        </label>
        <Input
          type="password"
          id="passwordConfirm"
          warningText={errorMessage.passwordConfirm}
          isWarning={isError.passwordConfirm}
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          onBlur={handleFocusout}
          onChange={handleChange}
        />
      </div>
      <Button disabled={isDisabled}>회원가입하기</Button>
    </div>
  );
}
