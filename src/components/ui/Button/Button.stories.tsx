import Button from './Button';

import GoogleIcon from '@/assets/Button/GoogleIcon.svg';
import UserIcon from '@/assets/Button/UserIcon.svg';
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
      <Button {...args}>내 정보</Button>
      <Button {...args} selected={true}>
        예약내역
      </Button>
      <Button {...args}>내 체험 관리</Button>
      <Button {...args}>예약현황</Button>
    </div>
  ),
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
