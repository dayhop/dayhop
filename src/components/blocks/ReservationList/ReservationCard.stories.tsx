import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReservationCard } from './ReservationCard';

const meta: Meta<typeof ReservationCard> = {
  title: 'Components/blocks/ReservationCard',
  component: ReservationCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    startTime: { control: 'text' },
    endTime: { control: 'text' },
    totalPrice: { control: 'text' },
    status: { control: 'text' },
    headCount: { control: 'number' },
  },
};
export default meta;

type Story = StoryObj<typeof ReservationCard>;

export const Default: Story = {
  args: {
    title: '함께 배우면 즐거운 스트릿 댄스',
    startTime: '11:00',
    endTime: '12:30',
    totalPrice: 10000,
    status: 'confirmed',
    headCount: 10,
  },
};
