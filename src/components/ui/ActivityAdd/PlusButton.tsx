import PlusIcon from '@/assets/icon/PlusIcon.svg';

export function PlusButton() {
  return (
    <button className="bg-primary active:bg-primary-500 cursor-pointer rounded-full p-2.5">
      <PlusIcon />
    </button>
  );
}
