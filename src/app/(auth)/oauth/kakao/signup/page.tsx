'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

import { postOauthSignUp } from '@/lib/api/oauth';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/store/useAuthStore';
import { REDIRECT_SIGNUP_URI } from '@/app/(auth)/components/Oauth';
import { generateRandomNickname } from '@/utils/randomNickname';

function KakaoSignUpForm() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [nickname, setNickname] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const params = useSearchParams();
  const token = params.get('code');

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
    try {
      const response = await postOauthSignUp('kakao', {
        nickname: nickname,
        redirectUri: REDIRECT_SIGNUP_URI,
        token: token,
      });
      showToast.success(response.user.nickname + '님 반갑습니다.');
      login(response.user);
      router.push('/');
    } catch (e) {
      showToast.error('이미 등록된 사용자입니다. 로그인해주세요');
      router.push('/login');
    }
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
          onClick={() => setNickname(generateRandomNickname())}
        >
          랜덤 닉네임
        </Button>
        <Button type="submit">회원가입하기</Button>
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
