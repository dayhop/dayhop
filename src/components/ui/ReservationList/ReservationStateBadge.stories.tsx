import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReservationStateBadge } from './ReservationStateBadge';

const meta = {
  title: 'UI/ReservationStateBadge',
  component: ReservationStateBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReservationStateBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmed: Story = {
  args: {
    reservationState: 'confirmed',
  },
};

export const Cancelled: Story = {
  args: {
    reservationState: 'cancelled',
  },
};

export const Rejected: Story = {
  args: {
    reservationState: 'rejected',
  },
};

export const Completed: Story = {
  args: {
    reservationState: 'completed',
  },
};
