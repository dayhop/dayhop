import { SignupForm } from '@/components/blocks/Signup/SignupForm';
import Link from 'next/link';
import { OAuth } from '../components/Oauth';
import Logo from '@/assets/icon/Logo.svg';

export default function SignupPage() {
  return (
    <div className="mx-auto mt-14 flex w-full max-w-140 flex-col items-center justify-center px-4 md:px-0">
      <Link href="/">
        <Logo />
      </Link>
      <SignupForm />
      <OAuth type="signup" />
    </div>
  );
}
