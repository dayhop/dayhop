'use client';

import { useState } from 'react';
import EyeOnIcon from '@/assets/icon/EyeOnIcon.svg';
import EyeOffIcon from '@/assets/icon/EyeOffIcon.svg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  warningText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isWarning?: boolean;
  isDisabled?: boolean;
}

export default function Input({
  warningText,
  prefix,
  suffix,
  isWarning,
  isDisabled,
  className,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div
        className={`flex h-[54px] items-center gap-2 rounded-2xl border bg-gray-50 px-4 ${
          isWarning ? 'border-red-500' : 'border-gray-200'
        } ${isDisabled ? 'opacity-40' : ''}`}
      >
        {prefix}
        <input
          className="w-full bg-transparent text-gray-950 placeholder-gray-400 outline-none disabled:cursor-not-allowed"
          disabled={isDisabled}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOnIcon width={20} height={20} />
            ) : (
              <EyeOffIcon width={20} height={20} />
            )}
          </button>
        ) : (
          suffix
        )}
      </div>
      {isWarning && warningText && <p className="text-sm text-red-500">{warningText}</p>}
    </div>
  );
}
