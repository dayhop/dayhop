'use client';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postOauthSignIn } from '@/lib/api/oauth';
import { showToast } from '@/utils/toast';
import { REDIRECT_URI } from '../../components/Oauth';
import { useAuthStore } from '@/store/useAuthStore';

export default function OauthPage() {
  const ref = useRef(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const handleAuth = async () => {
    if (!code) return;
    const body = {
      redirectUri: REDIRECT_URI,
      token: code,
    };

    const response = await postOauthSignIn('kakao', body);
    if (response.accessToken || response.refreshToken) {
      router.push('/');
      showToast.success(response.user.nickname + '님 반갑습니다.');
      login(response.user);
    } else {
      sessionStorage.setItem('oauth_code', code);
      router.push(`/oauth/signup`);
    }
  };

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    try {
      handleAuth();
    } catch (e) {
      console.error(e);
    }
  }, [code, router]);

  return <div>카카오 로그인 중... 잠시만 기다려주세요.</div>;
}
