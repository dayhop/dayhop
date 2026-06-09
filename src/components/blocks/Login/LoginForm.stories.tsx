import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoginForm } from './LoginForm';

const meta = {
  title: 'Blocks/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
