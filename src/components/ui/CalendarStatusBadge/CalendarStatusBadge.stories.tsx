import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarStatusBadge } from './CalendarStatusBadge';

const meta = {
  title: 'Components/UI/CalendarStatusBadge',
  component: CalendarStatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'radio',
      options: ['pending', 'confirmed', 'completed'],
      description: '예약 상태',
    },
    count: {
      control: 'number',
      description: '해당 상태의 예약 수',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-20">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalendarStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStatuses: Story = {
  args: {
    status: 'pending',
    count: 3,
  },
  render: () => (
    <div className="flex w-20 flex-col gap-1">
      <CalendarStatusBadge status="pending" count={3} />
      <CalendarStatusBadge status="confirmed" count={2} />
      <CalendarStatusBadge status="completed" count={5} />
    </div>
  ),
};

export const Pending: Story = {
  args: {
    status: 'pending',
    count: 3,
  },
};

export const Confirmed: Story = {
  args: {
    status: 'confirmed',
    count: 2,
  },
};

export const Completed: Story = {
  args: {
    status: 'completed',
    count: 5,
  },
};
