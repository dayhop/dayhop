import { SignupForm } from '@/components/blocks/Auth/Signup/SignupForm';
import Link from 'next/link';
import { OAuth } from '../../../components/blocks/Auth/Oauth/Oauth';
import Logo from '@/assets/icon/logoIcon.svg';
import { Suspense } from 'react';

export default function SignupPage() {
  return (
    <div className="mx-auto mt-14 flex w-full max-w-140 flex-col items-center justify-center px-4 md:px-0">
      <Link href="/">
        <Logo width={215} height={195} />
      </Link>
      <SignupForm />
      <Suspense fallback={<div>Loading...</div>}>
        <OAuth type="signup" />
      </Suspense>
    </div>
  );
}
