'use client';
import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postOauthSignIn } from '@/lib/api/oauth';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/store/useAuthStore';
import { REDIRECT_LOGIN_URI } from '../../../components/Oauth';

function KakaoLogin() {
  const ref = useRef(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const handleAuth = async () => {
    if (!code) return;
    const body = {
      redirectUri: REDIRECT_LOGIN_URI,
      token: code,
    };

    const response = await postOauthSignIn('kakao', body);
    if (response.accessToken || response.refreshToken) {
      router.push('/');
      showToast.success(response.user.nickname + '님 반갑습니다.');
      login(response.user);
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

export default function OauthPage() {
  return (
    <Suspense fallback={<div>카카오 로그인 정보를 불러오는 중입니다...</div>}>
      <KakaoLogin />
    </Suspense>
  );
}
