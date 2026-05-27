import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Modal from './Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">모달 제목</h2>

        <p>모달 내용입니다.</p>

        <button className="rounded bg-black px-4 py-2 text-white">확인</button>
      </div>
    ),
  },
};
