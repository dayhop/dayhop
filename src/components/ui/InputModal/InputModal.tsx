import { Modal } from '../Modal';
import CloseIcon from '@/assets/icons/icon-close.svg';

interface InputModalProps {
  title: string;
  date: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  className?: string;
}

export const InputModal = ({
  title,
  date,
  value,
  onChange,
  onClose,
  onSubmit,
  className,
}: InputModalProps) => {
  return (
    <Modal onClose={onClose} className={className}>
      <div className="relative flex flex-col">
        <button type="button" onClick={onClose} className="absolute top-0 right-0">
          <CloseIcon width={24} height={24} fill="currentColor" />
        </button>

        <div className="mt-4 text-center">
          <h2 className="text-sm font-bold">{title}</h2>
          <p className="mt-1 text-xs text-gray-400">{date}</p>
        </div>

        <div className="mt-4 flex justify-center gap-1 text-3xl text-gray-200">★ ★ ★ ★ ★</div>

        <p className="mt-5 text-sm font-bold">소중한 경험을 들려주세요</p>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={100}
          placeholder="체험에서 느낀 경험을 자유롭게 남겨주세요"
          className="mt-2 h-[150px] resize-none rounded-xl border border-gray-200 p-4 text-sm outline-none"
        />

        <p className="mt-1 text-right text-xs text-gray-400">{value.length}/100</p>

        <button
          type="button"
          onClick={onSubmit}
          className="bg-primary-500 mt-3 rounded-lg py-3 text-sm font-bold text-white"
        >
          작성하기
        </button>
      </div>
    </Modal>
  );
};
