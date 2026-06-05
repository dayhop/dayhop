import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SignupForm } from './SignupForm';

const meta = {
  title: 'Blocks/SignupForm',
  component: SignupForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
