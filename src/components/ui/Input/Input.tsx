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
  ...props
}: InputProps) {
  return <input {...props} />;
}
