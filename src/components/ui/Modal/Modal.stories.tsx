import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Modal } from './Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLabel: '기본 모달',
    children: (
      <div>
        <h2 className="text-xl font-bold">모달 제목</h2>
        <p className="mt-2 text-gray-700">모달 내용입니다.</p>
      </div>
    ),
  },
};

const CloseOnOverlayClickExample = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button className="bg-primary rounded px-4 py-2 text-white" onClick={() => setIsOpen(true)}>
        모달 열기
      </button>

      {isOpen && (
        <Modal ariaLabel="닫기 예시 모달" onClose={() => setIsOpen(false)} className="w-[400px]">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">모달 제목</h2>

            <p>바깥 영역을 클릭하면 모달이 닫힙니다.</p>

            <button
              className="bg-primary rounded px-4 py-2 text-white"
              onClick={() => setIsOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export const CloseOnOverlayClick: Story = {
  args: {
    ariaLabel: '닫기 예시 모달',
    children: <></>,
  },
  render: () => <CloseOnOverlayClickExample />,
};
