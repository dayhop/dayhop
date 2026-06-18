import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotFoundError } from './NotFoundError';

const meta = {
  title: 'Components/Blocks/ErrorPage/NotFoundError',
  component: NotFoundError,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotFoundError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
