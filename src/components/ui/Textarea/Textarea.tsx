import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type TextareaVariant = 'default' | 'review';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  showCount?: boolean;
  label?: string;
}

const textareaLabelClassName = {
  default: 'mb-[10px] block text-[16px] font-bold text-text-primary md:text-base',
  review: 'mb-3 block text-[16px] font-bold text-black md:text-[18px]',
};

const textareaVariantClassName = {
  default: 'h-[140px] md:h-[200px] py-4 px-5 rounded-2xl shadow-[0_2px_6px_0_rgba(0,0,0,0.02)]',
  review: 'h-[179px] p-5 rounded-xl shadow-[0_4px_24px_0_rgba(156,180,202,0.20)]',
};

export const Textarea = ({
  variant = 'default',
  showCount = false,
  maxLength,
  className,
  value,
  label,
  id,
  ...props
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const count = String(value ?? '').length;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className={textareaLabelClassName[variant]}>
          {label}
        </label>
      )}
      <div
        className={twMerge(
          'w-full overflow-hidden border border-(--color-border-default) bg-(--color-bg)',
          'focus-within:border-gray-300',
          textareaVariantClassName[variant],
          className
        )}
      >
        <textarea
          id={textareaId}
          value={value}
          maxLength={maxLength}
          {...props}
          className={twMerge(
            'custom-textarea-scrollbar h-full w-full resize-none bg-transparent text-sm leading-[1.8] font-medium text-(--color-text-primary) outline-none',
            'md:text-base',
            'placeholder:text-(--color-text-placeholder)'
          )}
        />
      </div>

      {showCount && maxLength && (
        <div className="mt-2 text-right text-[13px] font-medium text-gray-600">
          {count}/{maxLength}
        </div>
      )}
    </div>
  );
};
