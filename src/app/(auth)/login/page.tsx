import Logo from '@/assets/icon/Logo.svg';

import { LoginForm } from '@/components/blocks/Login/LoginForm';
import Link from 'next/link';
import { OAuth } from '../components/Oauth';

export default function LoginPage() {
  return (
    <div className="mb- mx-auto mt-14 flex w-full max-w-140 flex-col items-center justify-center px-4 md:px-0">
      <Link href="/">
        <Logo />
      </Link>
      <LoginForm />
      <OAuth type="login" />
    </div>
  );
}
