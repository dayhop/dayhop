import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ErrorState } from './ErrorState';
import Error404 from '@/assets/icon/Error404.svg';
import WarningIcon from '@/assets/icon/WarningIcon.svg';

const meta = {
  title: 'Components/UI/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    Illustration: {
      control: false,
      description: '에러 일러스트 SVG 컴포넌트',
    },
    message: {
      control: 'text',
      description: '에러 안내 문구',
    },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {
  args: {
    Illustration: Error404,
    message: '페이지를 찾을 수 없어요.',
  },
};

export const ServerError: Story = {
  args: {
    Illustration: WarningIcon,
    message: '문제가 발생했어요. 잠시 후 다시 시도해주세요.',
  },
};
