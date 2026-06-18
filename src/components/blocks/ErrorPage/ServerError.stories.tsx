import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ServerError } from './ServerError';

const meta = {
  title: 'Components/Blocks/ErrorPage/ServerError',
  component: ServerError,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onRetry: fn(),
  },
} satisfies Meta<typeof ServerError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
