import Button from './Button';

import GoogleIcon from '@/assets/icon/GoogleIcon.svg';
import UserIcon from '@/assets/icon/UserIcon.svg';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'text'],
    },
    size: {
      control: { type: 'select' },
      options: ['lg', 'md', 'sm'],
    },
    disabled: { control: 'boolean' },
    Icon: { control: false },
    width: {
      control: 'text',
      description: '버튼의 넓이 (예: "100%", "300px", 200)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    Icon: GoogleIcon,
    width: '500px',
    children: '구글로그인',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    size: 'md',
    Icon: UserIcon,
    selected: false,
  },
  render: (args) => (
    <div className="flex w-80 flex-col items-center gap-4">
      <Button {...args} width={300}>
        내 정보
      </Button>
      <Button {...args} width={300} selected={true}>
        예약내역
      </Button>
      <Button {...args} width={300}>
        내 체험 관리
      </Button>
      <Button {...args} width={300}>
        예약현황
      </Button>
    </div>
  ),
};

export const CustomWidth: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    width: '300px',
    children: '넓이 300px',
  },
};
export const Sizes: Story = {
  args: {
    variant: 'primary',
    children: 'Size',
  },
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};
