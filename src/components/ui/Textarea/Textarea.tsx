import type { TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type TextareaVariant = 'default' | 'review';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  showCount?: boolean;
  label?: string;
}

const textareaLabelClassName = {
  default: 'mb-[10px] block text-[16px] font-bold text-[#1F1F22]',
  review: 'mb-3 block text-[16px] font-bold text-black',
};

const textareaVariantClassName = {
  default: 'h-[140px] py-4 px-5 rounded-2xl shadow-[0_2px_6px_0_rgba(0,0,0,0.02)]',
  review: 'h-[179px] p-5 rounded-xl shadow-[0_4px_24px_0_rgba(156,180,202,0.20)]',
};

const Textarea = ({
  variant = 'default',
  showCount = false,
  maxLength,
  className,
  value,
  label,
  id,
  ...props
}: TextareaProps) => {
  const count = String(value ?? '').length;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={textareaLabelClassName[variant]}>
          {label}
        </label>
      )}
      <div
        className={twMerge(
          'w-full overflow-hidden border border-[#E0E0E5] bg-white',
          'focus-within:border-gray-300',
          textareaVariantClassName[variant],
          className
        )}
      >
        <textarea
          id={id}
          value={value}
          maxLength={maxLength}
          {...props}
          className={twMerge(
            'custom-textarea-scrollbar h-full w-full resize-none bg-transparent text-sm leading-[1.8] font-medium outline-none',
            'placeholder:text-[#9FA0A7]'
          )}
        />
      </div>

      {showCount && maxLength && (
        <div className="mt-2 text-right text-[13px] font-medium text-[#707177]">
          {count}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default Textarea;
