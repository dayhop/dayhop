import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmptyReservationList } from './EmptyReservationList';

const meta: Meta<typeof EmptyReservationList> = {
  title: 'Components/Blocks/ReservationList/EmptyReservationList',
  component: EmptyReservationList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyReservationList>;

export const Default: Story = {};
