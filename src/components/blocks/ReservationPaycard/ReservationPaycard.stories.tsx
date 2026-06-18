import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReservationPaycard } from './ReservationPaycard';

const meta = {
  title: 'Components/Blocks/ReservationPaycard',
  component: ReservationPaycard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    activityId: 1,
    price: 1000,
    activityTitle: '인기 절정 서울 시티 투어 버스 체험',
  },
} satisfies Meta<typeof ReservationPaycard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Expensive: Story = {
  args: {
    activityId: 2,
    price: 99000,
    activityTitle: '프리미엄 제주 요트 투어 및 바베큐 패키지',
  },
};
