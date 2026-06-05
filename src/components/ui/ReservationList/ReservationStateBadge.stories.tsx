import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReservationStateBadge } from './ReservationStateBadge';

const meta = {
  title: 'components/UI/ReservationStateBadge',
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
    reservationState: 'canceled',
  },
};

export const Declined: Story = {
  args: {
    reservationState: 'declined',
  },
};

export const Completed: Story = {
  args: {
    reservationState: 'completed',
  },
};

export const Pending: Story = {
  args: {
    reservationState: 'pending',
  },
};
