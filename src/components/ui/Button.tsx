import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center w-auto cursor-pointer font-medium px-4 transition-colors disabled:opacity-50 disabled:pointer-events-none px-10 py-3.5",
  {
    variants: {
      variant: {
        primary: "bg-[#3D9EF2] text-white disabled:bg-[#C6C8CF]",
        secondary:
          "bg-white text-gray-700 active:bg-[#3D9EF2] active:text-[#FFF] disabled:text-[#C6C8CF] border border-[#C6C8CF]",
        text: "bg-white text-gray-700 border border-gray-200",
      },
      size: {
        lg: "h-13.5 rounded-[16px]",
        md: "h-12 rounded-[14px]",
        sm: "py-3 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    leftIcon?: React.ReactNode;
  };

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, leftIcon, children, ...props }, ref) => {
    const hasIcon = Boolean(leftIcon);

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {leftIcon && (
          <span className="inline-flex items-center">{leftIcon}</span>
        )}
        <span className="inline-block">{children}</span>
      </button>
    );
  },
);
Button.displayName = "Button";

export default Button;
