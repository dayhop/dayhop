import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Popover } from './Popover';

const meta = {
  title: 'Components/UI/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: '메뉴 열기',
    items: [
      {
        label: '수정하기',
        onClick: () => alert('수정하기 클릭'),
      },
      {
        label: '삭제하기',
        variant: 'delete',
        onClick: () => alert('삭제하기 클릭'),
      },
    ],
  },
};
