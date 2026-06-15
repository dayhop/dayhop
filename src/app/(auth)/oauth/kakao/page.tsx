'use client';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postOauthSignIn, postOauthSignUp } from '@/lib/api/oauth';
import { showToast } from '@/utils/toast';
import { REDIRECT_URI } from '../../components/Oauth';

export default function OauthPage() {
  const ref = useRef(false);
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
    } else {
      router.push(`/oauth/signup?code=${code}`);
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
