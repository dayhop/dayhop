import Logo from '@/assets/icon/Logo.svg';
import { LoginForm } from '@/components/blocks/Login/LoginForm';
import { OAuth } from '../components/Oauth';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="mx-auto mt-14 flex w-full max-w-140 flex-col items-center justify-center px-4 md:px-0">
      <Link href="/">
        <Logo />
      </Link>
      <LoginForm />
      <OAuth type="login" />
    </div>
  );
}
