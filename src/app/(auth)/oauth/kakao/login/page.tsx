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
    const res = await postOauthSignIn('kakao', body);
    if (!res.success) {
      showToast.error(res.message);
      router.push('/login');
      return;
    }
    if (res.data.accessToken || res.data.refreshToken) {
      showToast.success(res.data.user.nickname + '님 반갑습니다.');
      login(res.data.user);
      router.push('/');
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
