import Input from './Input';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    isWarning: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    warningText: { control: 'text' },
    prefix: { control: false },
    suffix: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: '이메일을 입력해 주세요',
    className: 'w-80',
  },
};
