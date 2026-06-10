import PlusIcon from '@/assets/icon/PlusIcon.svg';

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function PlusButton({ onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-primary active:bg-primary-500 cursor-pointer rounded-full p-2.5"
    >
      <PlusIcon />
    </button>
  );
}
