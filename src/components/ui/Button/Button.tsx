import React, { forwardRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center w-full cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'justify-center bg-[#3D9EF2] text-white disabled:bg-[#C6C8CF] active:bg-[#2f6bff]', //active 색상 임의로 지정
        secondary:
          //secondary에서도 active 색상 임의 지정 피그마 시안::  #C6C8CF
          'justify-center bg-white text-gray-700 active:bg-[#2f6bff] active:text-[#FFF] disabled:text-[#C6C8CF] border border-[#C6C8CF]',
        text: 'bg-white text-gray-700 border border-gray-200 hover:bg-[#E5F3FF]',
      },
      size: {
        lg: 'h-[54px] px-10 rounded-[16px]',
        md: 'h-[48px] px-8 rounded-[14px]',
        sm: 'h-[40px] px-6 rounded-[12px]',
      },
      withIcon: {
        true: 'gap-2',
        false: '',
      },
      selected: {
        true: 'bg-[#E5F3FF]',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'text',
        selected: true,
        className: 'bg-[#E5F3FF] text-black',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      withIcon: false,
      selected: false,
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    Icon?: React.ReactNode;
  };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, selected, Icon, children, ...props }, ref) => {
    const hasIcon = Boolean(Icon);

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            selected: selected,
            withIcon: hasIcon,
          }),
          className
        )}
        {...props}
      >
        {Icon && <span className="inline-flex h-5 w-5 items-center justify-center">{Icon}</span>}
        <span className="inline-block">{children}</span>
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
