import React, { forwardRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Spinner } from '@/components/ui/Spinner';
const buttonVariants = cva(
  'inline-flex items-center cursor-pointer transition-colors disabled:pointer-events-none font-medium w-full',
  {
    variants: {
      variant: {
        primary:
          'justify-center bg-primary text-white disabled:bg-gray-200 active:bg-primary-button-active hover:bg-primary-button-hover',
        secondary:
          'justify-center bg-white text-gray-700 disabled:text-gray-200 border border-gray-200 hover:bg-secondary-button-hover active:bg-secondary-button-active',
        text: 'bg-white hover:bg-primary-100 text-gray-600',
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
    isLoading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      selected,
      Icon,
      children,
      type = 'button',
      style,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasIcon = Boolean(Icon) || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants({
            variant,
            size,
            selected: selected,
            withIcon: hasIcon,
          }),
          className
        )}
        style={{ ...style }}
        {...props}
      >
        {isLoading && <Spinner className="h-5 w-5" />}
        {Icon && !isLoading && (
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <Icon
              className={cn(
                variant === 'text' && (selected ? 'text-primary-500' : 'text-gray-600')
              )}
            />
          </span>
        )}
        {children && <span className="inline-block">{children}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
