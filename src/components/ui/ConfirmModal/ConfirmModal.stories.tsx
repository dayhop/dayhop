import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';

const meta = {
  title: 'Components/UI/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: 400,
    },
  },
  argTypes: {
    isOpen: { control: 'boolean', description: '모달 노출 여부' },
    message: { control: 'text', description: '모달 본문 메시지' },
    confirmText: { control: 'text', description: '확인 버튼 텍스트' },
    cancelText: { control: 'text', description: '취소 버튼 텍스트' },
    onClose: { action: 'onClose', description: '취소/닫기 핸들러' },
    onConfirm: { action: 'onConfirm', description: '확인 핸들러' },
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;

type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    isOpen: true,
    message: '이 작업을 수행하시겠습니까?',
    confirmText: '확인',
    cancelText: '취소',
  },
};

// 피그마 시안 매칭 스토리 (아니오 / 취소하기)
export const DesignMockup: Story = {
  args: {
    isOpen: true,
    message: 'text',
    confirmText: '취소하기',
    cancelText: '아니오',
  },
};

// 인터랙티브 데모 스토리
const InteractiveConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [actionLog, setActionLog] = useState<string>('');

  return (
    <div className="p-4">
      <button
        onClick={() => {
          setIsOpen(true);
          setActionLog('');
        }}
        className="bg-primary-500 hover:bg-primary-dark cursor-pointer rounded-lg px-4 py-2 font-medium text-white transition-colors"
      >
        모달 열기
      </button>

      {actionLog && (
        <div className="text-text-secondary mt-4 text-sm">
          마지막 액션: <span className="text-text-primary font-bold">{actionLog}</span>
        </div>
      )}

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setActionLog('취소 (아니오) 클릭됨');
        }}
        onConfirm={() => {
          setIsOpen(false);
          setActionLog('확인 (취소하기) 클릭됨');
        }}
        message={`신청하신 예약이 취소되며,\n다시 복구할 수 없습니다.\n\n정말 취소하시겠습니까?`}
        confirmText="취소하기"
        cancelText="아니오"
      />
    </div>
  );
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    message: '',
  },
  render: () => <InteractiveConfirmModal />,
};
