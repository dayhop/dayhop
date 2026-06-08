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
}
export function AuthForm({
  title,
  errorMessage,
  isError,
  handleChange,
  handleFocusout,
  placeholder,
  type,
  label,
}: AuthFormProps) {
  return (
    <div className="flex flex-col gap-2">
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
      />
    </div>
  );
}
