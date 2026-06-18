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
    if (!code) {
      showToast.error('유효하지 않은 토큰입니다.');
      router.push('/login');
      return;
    }
    const body = {
      redirectUri: REDIRECT_LOGIN_URI,
      token: code,
    };
    try {
      const response = await postOauthSignIn('kakao', body);
      if (response.accessToken || response.refreshToken) {
        showToast.success(response.user.nickname + '님 반갑습니다.');
        login(response.user);
        router.push('/');
      }
    } catch (e) {
      showToast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      router.push('/login');
    }
  };

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    handleAuth();
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
