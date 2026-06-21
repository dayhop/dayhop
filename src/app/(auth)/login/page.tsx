import Logo from '@/assets/icon/logoIcon.svg';
import { LoginForm } from '@/components/blocks/Login/LoginForm';
import { OAuth } from '../components/Oauth';
import Link from 'next/link';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="mx-auto mt-14 flex w-full max-w-140 flex-col items-center justify-center px-4 md:px-0">
      <Link href="/">
        <Logo width={215} height={195} />
      </Link>
      <LoginForm />
      <Suspense fallback={<div>Loading...</div>}>
        <OAuth type="login" />
      </Suspense>
    </div>
  );
}
