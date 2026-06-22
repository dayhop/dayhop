import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ActivityCard } from './ActivityCard';

import type { ActivityCategory, ActivityItem } from '@/lib/api/activities/type';

const mockActivity: ActivityItem = {
  id: 1,
  userId: 1,
  title: '도심 속 한강 요트 투어',
  description: '한강에서 즐기는 프리미엄 요트 체험',
  category: '투어' as ActivityCategory,
  price: 45000,
  address: '서울특별시 영등포구',
  bannerImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  rating: 4.8,
  reviewCount: 128,
  createdAt: '2025-06-01T00:00:00.000Z',
  updatedAt: '2025-06-01T00:00:00.000Z',
};

const mockActivities: ActivityItem[] = Array.from({ length: 8 }, (_, index) => ({
  ...mockActivity,
  id: index + 1,
  title: `테스트 체험 ${index + 1}`,
  price: 30000 + index * 1000,
  bannerImageUrl: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80&ix=${index}`,
}));

const meta = {
  title: 'UI/ActivityCard',
  component: ActivityCard,
  args: {
    activity: mockActivity,
  },
} satisfies Meta<typeof ActivityCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithReview: Story = {
  args: {
    activity: mockActivity,
    hoverReview: {
      nickname: '데이호퍼',
      rating: 5,
      content: '정말 재밌는 체험이었어요! 직원분들도 친절하시고 다음에 또 방문하고 싶습니다.',
    },
  },
};
