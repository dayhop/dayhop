'use client';

import { Modal } from '@/components/ui/Modal';

interface CalendarMyActivitiesModalProps {
  onClose: () => void;
}

export const CalendarMyActivitiesModal = ({ onClose }: CalendarMyActivitiesModalProps) => {
  return (
    <Modal onClose={onClose} ariaLabel="예약 현황">
      모달
    </Modal>
  );
};
