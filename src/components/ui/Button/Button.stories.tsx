import { Button } from './Button';

import GoogleIcon from '@/assets/icon/GoogleIcon.svg';
import UserIcon from '@/assets/icon/UserIcon.svg';
import ListIcon from '@/assets/icon/ListIcon.svg';
import CalendarIcon from '@/assets/icon/CalendarIcon.svg';
import SettingIcon from '@/assets/icon/SettingIcon.svg';

import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Button> = {
  title: 'Components/UI/Button',
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
    selected: false,
  },
  render: (args) => (
    <div className="flex w-80 flex-col items-center gap-4">
      <Button {...args} className="w-75" Icon={UserIcon}>
        내 정보
      </Button>
      <Button {...args} className="w-75" selected={true} Icon={ListIcon}>
        예약내역
      </Button>
      <Button {...args} className="w-75" Icon={CalendarIcon}>
        내 체험 관리
      </Button>
      <Button {...args} className="w-75" Icon={SettingIcon}>
        예약현황
      </Button>
    </div>
  ),
};

export const CustomWidth: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    className: 'w-75',
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

export const DisabledButton: Story = {
  args: {
    size: 'lg',
    children: 'Disabled Button',
  },
  render: (args) => (
    <div>
      <Button {...args} disabled={true} variant="primary">
        Disabled Button
      </Button>
      <Button {...args} disabled={true} variant="secondary">
        Disabled Button
      </Button>
      <Button {...args} disabled={true} variant="text" Icon={UserIcon}>
        Disabled Button
      </Button>
    </div>
  ),
};
