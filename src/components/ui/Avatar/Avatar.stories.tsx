import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

//src 이미지가 없을 경우
export const Default: Story = {
  args: {
    size: 'md',
  },
};

//src 이미지가 있을 경우
export const WithSrcImage: Story = {
  args: {
    src: '/images/avatar-sample.jpg',
  },
};

// Small 사이즈 (767px이하: 20px / 768px이상: 24px)
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

// Medium 사이즈 (30px)
export const Medium: Story = {
  args: {
    size: 'md',
  },
};

// Large 사이즈 (767px이하: 70px / 768px이상: 120px)
export const Large: Story = {
  args: {
    size: 'lg',
  },
};
