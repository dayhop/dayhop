'use client';

import { Modal } from '@/components/ui/Modal';

interface CalendarMyActivitiesModalProps {
  onClose: () => void;
  className?: string;
  overlayClassName?: string;
}

export const CalendarMyActivitiesModal = ({
  onClose,
  className,
  overlayClassName,
}: CalendarMyActivitiesModalProps) => {
  return (
    <Modal
      onClose={onClose}
      ariaLabel="예약 현황 모달"
      className={className}
      overlayClassName={overlayClassName}
    >
      모달
    </Modal>
  );
};
