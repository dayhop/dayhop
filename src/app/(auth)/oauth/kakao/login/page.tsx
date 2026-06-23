'use client';
import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postOauthSignIn } from '@/lib/api/oauth';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/store/useAuthStore';
import { getBaseUrl } from '@/utils/getBaseUrl';
import { OauthLoading } from '@/components/blocks/Auth/Oauth/OauthLoading';

function KakaoLogin() {
  const ref = useRef(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const BASE_URL = getBaseUrl();

  const KAKAO_LOGIN_REDIRECT_URI = `${BASE_URL}/oauth/kakao/login/`;

  const handleAuth = async () => {
    if (!code) {
      showToast.error('유효하지 않은 토큰입니다.');
      router.push('/singup');
      return;
    }
    const body = {
      redirectUri: KAKAO_LOGIN_REDIRECT_URI,
      token: code,
    };
    const res = await postOauthSignIn('kakao', body);
    if (!res.success) {
      showToast.error(res.message);
      router.push('/signup');
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

  return <OauthLoading />;
}

export default function OauthPage() {
  return (
    <Suspense fallback={<div>카카오 로그인 정보를 불러오는 중입니다...</div>}>
      <KakaoLogin />
    </Suspense>
  );
}
