import { cn } from '@/utils/cn';
import Input from '../../ui/Input';
interface AuthFormProps {
  title: string;
  errorMessage: string;
  isError: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocusout: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  label: string;
  className?: string;
  value?: string;
  suffix?: React.ReactNode;
}
export function AuthField({
  title,
  errorMessage,
  isError,
  handleChange,
  handleFocusout,
  placeholder,
  type,
  label,
  className,
  value,
  suffix,
}: AuthFormProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={label} className="text-secondary text-sm font-semibold">
        {title}
      </label>
      <Input
        type={type}
        id={label}
        warningText={errorMessage}
        isWarning={isError}
        placeholder={placeholder}
        onBlur={handleFocusout}
        onChange={handleChange}
        value={value}
        suffix={suffix}
      />
    </div>
  );
}
