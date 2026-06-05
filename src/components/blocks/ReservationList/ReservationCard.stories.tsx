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
    bannerImageUrl: { control: 'text' },
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
    bannerImageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVEnkMvP0UMsW3ok8sTu1gwzHNjTmsuDTZ2w&s',
  },
};
