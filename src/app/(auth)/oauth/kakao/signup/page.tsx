'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

import { postOauthSignUp } from '@/lib/api/oauth';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/store/useAuthStore';
import { generateRandomNickname } from '@/utils/randomNickname';
import { getBaseUrl } from '@/utils/getBaseUrl';

function KakaoSignUpForm() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [nickname, setNickname] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const params = useSearchParams();
  const token = params.get('code');

  const BASE_URL = getBaseUrl();
  const KAKAO_SIGNUP_REDIRECT_URI = `${BASE_URL}/oauth/kakao/signup/`;

  const handleClickSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      showToast.error('유효하지 않은 접근입니다.');
      router.push('/signup');
      return;
    }
    if (!nickname.trim()) {
      setErrorMessage('닉네임을 입력해주세요');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    const res = await postOauthSignUp('kakao', {
      nickname: nickname,
      redirectUri: KAKAO_SIGNUP_REDIRECT_URI,
      token: token,
    });
    if (!res.success) {
      showToast.error(res.message);
      router.push('/login');
      return;
    }
    showToast.success(res.data.user.nickname + '님 반갑습니다.');
    login(res.data.user);
    router.push('/');
  };
  return (
    <form className="mx-auto mt-50 flex max-w-100 flex-col gap-3" onSubmit={handleClickSignup}>
      <label htmlFor="name">닉네임</label>
      <Input
        warningText={errorMessage}
        id="name"
        placeholder="닉네임을 입력해주세요"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div className="flex gap-4">
        <Button
          variant="secondary"
          type="button"
          disabled={isSubmitting}
          onClick={() => setNickname(generateRandomNickname())}
        >
          랜덤 닉네임
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          회원가입하기
        </Button>
      </div>
    </form>
  );
}

export default function KakaoSignUpPage() {
  return (
    <Suspense fallback={<div>페이지를 불러오는 중입니다...</div>}>
      <KakaoSignUpForm />
    </Suspense>
  );
}
