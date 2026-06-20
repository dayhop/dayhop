import { ReactNode } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import WarningIcon from '@/assets/icon/WarningIcon.svg';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = '확인',
  cancelText = '취소',
  isLoading = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} className="w-[320px] max-w-[calc(100vw-32px)] !p-8 md:w-[400px]">
      <div className="flex flex-col items-center text-center">
        {/* svg아이콘 */}
        <WarningIcon className="mb-4 h-[88px] w-[88px]" />

        {/* 메세지 */}
        <div className="text-text-primary mb-8 text-base leading-normal font-bold whitespace-pre-wrap">
          {message}
        </div>

        {/* 버튼, cdd개발에서도 같은 단위의 컴포넌트를 사용해도 되는가. */}
        <div className="flex w-full gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 md:px-8"
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 md:px-8"
          >
            {isLoading ? '처리 중...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
