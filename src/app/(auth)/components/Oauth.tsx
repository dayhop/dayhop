import { Button } from '@/components/ui/Button';
import Kakao from '@/assets/icon/Kakao.svg';
import Link from 'next/link';

interface type {
  type: 'signup' | 'login';
}
export function OAuth({ type }: type) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="text-text-placeholder my-7.5 flex w-full items-center gap-3.5">
        <hr className="border-0.5 flex-1" /> or <hr className="border-0.5 flex-1" />
      </div>
      <Button variant="secondary" Icon={Kakao} className="border-none bg-[#f7e600]">
        카카오 {type === 'login' ? '로그인' : '회원가입'}
      </Button>
      <div className="text-text-placeholder my-7.5">
        {type === 'login' ? `회원이 아니신가요? ` : '이미 회원이신가요? '}
        {type === 'login' ? (
          <Link href="/signup" className="underline">
            회원가입
          </Link>
        ) : (
          <Link href="/login" className="underline">
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}
