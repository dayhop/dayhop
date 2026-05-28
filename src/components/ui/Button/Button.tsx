import React, { forwardRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'justify-center bg-primary-500 text-white disabled:bg-gray-200 active:bg-primary-dark', //active 색상 임의로 지정
        secondary:
          //secondary에서도 active 색상 임의 지정 피그마 시안::  #C6C8CF
          'justify-center bg-white text-gray-700 active:bg-primary-dark active:text-white disabled:text-gray-200 border border-gray-200',
        text: 'bg-white text-gray-700 border border-gray-200 hover:bg-primary-100',
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
        true: 'bg-primary-100',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'text',
        selected: true,
        className: 'bg-primary-100 text-black',
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
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    width?: string | number;
  };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, selected, Icon, children, type = 'button', width, style, ...props },
    ref
  ) => {
    const hasIcon = Boolean(Icon);

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          buttonVariants({
            variant,
            size,
            selected: selected,
            withIcon: hasIcon,
          }),
          className
        )}
        style={{ width, ...style }}
        {...props}
      >
        {Icon && (
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <Icon />
          </span>
        )}
        {children && <span className="inline-block">{children}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
