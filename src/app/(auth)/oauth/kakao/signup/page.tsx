'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { REDIRECT_URI } from '../../../components/Oauth';
import { postOauthSignUp } from '@/lib/api/oauth';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function KakaoSignUpPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [nickname, setNickname] = useState<string>('');

  const params = useSearchParams();
  const token = params.get('code');

  const handleClickSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!token) return;
      const response = await postOauthSignUp('kakao', {
        nickname: nickname,
        redirectUri: REDIRECT_URI,
        token: token,
      });
      showToast.success(response.user.nickname + '님 반갑습니다.');
      login(response.user);
      router.push('/');
    } catch {
      router.push('/signup');
    }
  };
  return (
    <form className="mx-auto mt-50 flex max-w-100 flex-col gap-3" onSubmit={handleClickSignup}>
      <label htmlFor="name">닉네임</label>
      <Input
        id="name"
        placeholder="닉네임을 입력해주세요"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div className="flex gap-4">
        <Button variant="secondary" type="button">
          랜덤 닉네임
        </Button>
        <Button type="submit">회원가입하기</Button>
      </div>
    </form>
  );
}
