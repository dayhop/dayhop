import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { InputModal } from './InputModal';

const meta = {
  title: 'UI/InputModal',
  component: InputModal,
} satisfies Meta<typeof InputModal>;

export default meta;

type Story = StoryObj<typeof InputModal>;

const InputModalExample = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [value, setValue] = useState('');

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        모달 열기
      </button>

      {isOpen && (
        <InputModal
          title="함께 배우면 즐거운 스트릿 댄스"
          date="2023. 02. 14 / 11:00 - 12:30 (10명)"
          value={value}
          onChange={setValue}
          onClose={() => setIsOpen(false)}
          onSubmit={() => {
            alert(`리뷰 내용: ${value}`);
            setIsOpen(false);
          }}
          className="w-[336px] rounded-3xl"
        />
      )}
    </>
  );
};

export const Default: Story = {
  render: () => <InputModalExample />,
};
