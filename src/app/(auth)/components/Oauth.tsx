'use client';

import { Button } from '@/components/ui/Button';
import Kakao from '@/assets/icon/Kakao.svg';
import Link from 'next/link';

interface OAuthProp {
  type: 'signup' | 'login';
}

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
export const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export function OAuth({ type }: OAuthProp) {
  const handleClickKakaoLogin = () => {
    window.location.href = kakaoURL;
  };
  return (
    <div className="flex w-full flex-col items-center">
      <div className="text-text-placeholder my-7.5 flex w-full items-center gap-3.5">
        <hr className="border-0.5 flex-1" /> or <hr className="border-0.5 flex-1" />
      </div>
      <Button
        variant="secondary"
        Icon={Kakao}
        className="bg-kakao-button active:bg-kakao-button-active hover:bg-kakao-button-hover border-none"
        onClick={handleClickKakaoLogin}
      >
        카카오 {type === 'login' ? '로그인' : '회원가입'}
      </Button>
      <div className="text-text-placeholder my-7.5">
        {type === 'login' ? `회원이 아니신가요? ` : '이미 회원이신가요? '}
        {type === 'login' ? (
          <Link href="/signup" className="underline">
            회원가입하기
          </Link>
        ) : (
          <Link href="/login" className="underline">
            로그인하기
          </Link>
        )}
      </div>
    </div>
  );
}
