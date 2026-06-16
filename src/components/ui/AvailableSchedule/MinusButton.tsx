import MinusIcon from '@/assets/icon/MinusIcon.svg';

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MinusButton({ onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-bg-surface active:bg-text-placeholder cursor-pointer rounded-full p-2.5"
    >
      <MinusIcon />
    </button>
  );
}
