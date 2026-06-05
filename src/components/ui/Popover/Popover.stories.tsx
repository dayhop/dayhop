import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Popover } from './Popover';

const meta = {
  title: 'Components/UI/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="ml-100 h-50">
      <Popover>
        <Popover.Content className="top-full right-0 w-[220px] rounded-xl bg-white p-6 shadow-lg">
          <p className="text-text-secondary text-sm">어떤 내용이든 자유롭게 들어갈 수 있습니다.</p>
        </Popover.Content>
      </Popover>
    </div>
  ),
};
