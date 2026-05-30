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
        className="bg-primary-500 rounded px-4 py-2 text-white"
      >
        모달 열기
      </button>

      {isOpen && (
        <InputModal
          message="내용을 입력해주세요."
          value={value}
          onChange={setValue}
          onConfirm={() => {
            alert(`입력값: ${value}`);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
          className="w-[336px] rounded-3xl"
        />
      )}
    </>
  );
};

export const Default: Story = {
  render: () => <InputModalExample />,
};
