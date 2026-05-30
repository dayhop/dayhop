import CloseIcon from '@/assets/icons/icon-close.svg';

import { Button } from '../Button';
import { Modal } from '../Modal';

interface InputModalProps {
  message: string;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

export const InputModal = ({
  message,
  value,
  onChange,
  onConfirm,
  onCancel,
  className,
}: InputModalProps) => {
  return (
    <Modal onClose={onCancel} className={className}>
      <div className="relative flex flex-col gap-4">
        <button type="button" onClick={onCancel} className="absolute top-0 right-0" aria-label="닫기">
          <CloseIcon width={24} height={24} fill="currentColor" />
        </button>

        <p className="pr-8 text-sm font-bold">{message}</p>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="내용을 입력해주세요"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
        />

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            취소
          </Button>

          <Button variant="primary" size="sm" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};
