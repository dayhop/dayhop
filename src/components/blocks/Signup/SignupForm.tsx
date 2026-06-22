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
import { useRouter } from 'next/navigation';
import { generateRandomNickname } from '@/utils/randomNickname';
import { Modal } from '@/components/ui/Modal';
import { postLogin } from '@/lib/api/auth';
import { useAuthStore } from '@/store/useAuthStore';

export function SignupForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    if (isSubmitting) return;
    setIsSubmitting(true);
    const requestBody = {
      email: formData.email,
      nickname: formData.name,
      password: formData.password,
    };
    const res = await postSignUp(requestBody);
    if (!res.success) {
      showToast.error(res.message);
      setIsSubmitting(false);
      return;
    }
    setIsOpen(true);
  };

  const handleClickSuccessSignUp = async () => {
    const body = {
      email: formData.email,
      password: formData.password,
    };
    const res = await postLogin(body);

    if (!res.success) {
      showToast.error(res.message);
      router.push('/login');
      return;
    }
    login(res.data.user);
    router.push('/');
  };

  return (
    <div>
      {isOpen && (
        <Modal className="flex w-80 flex-col gap-8 p-10">
          <div className="mx-auto text-lg font-semibold">{formData.name}님 환영합니다! </div>
          <Button size="md" onClick={handleClickSuccessSignUp}>
            HOP하러 가기
          </Button>
        </Modal>
      )}
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
            onClick={() => {
              const nickname = generateRandomNickname();
              setFormData((prev) => ({ ...prev, name: nickname }));
              setErrorMessage((prev) => ({ ...prev, name: '' }));
            }}
            type="button"
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
          isLoading={isSubmitting}
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
    </div>
  );
}
