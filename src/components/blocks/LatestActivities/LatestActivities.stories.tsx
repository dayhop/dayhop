import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LatestActivities } from './LatestActivities';

const meta = {
  title: 'Blocks/LatestActivities',
  component: LatestActivities,
} satisfies Meta<typeof LatestActivities>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activities: [
      {
        id: 1,
        userId: 1,
        title: '함께 배우면 즐거운 스트릿 댄스',
        description: '초보자도 쉽게 참여할 수 있는 댄스 클래스입니다.',
        category: '문화 · 예술',
        price: 30000,
        address: '서울특별시 강남구',
        bannerImageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e',
        rating: 4.8,
        reviewCount: 128,
        createdAt: '2026-06-17T00:00:00.000Z',
        updatedAt: '2026-06-17T00:00:00.000Z',
      },
      {
        id: 2,
        userId: 1,
        title: '도심 속 감성 쿠킹 클래스',
        description: '맛있는 요리를 직접 만들어보는 체험입니다.',
        category: '식음료',
        price: 45000,
        address: '서울특별시 마포구',
        bannerImageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
        rating: 4.9,
        reviewCount: 94,
        createdAt: '2026-06-17T00:00:00.000Z',
        updatedAt: '2026-06-17T00:00:00.000Z',
      },
      {
        id: 3,
        userId: 1,
        title: '한강에서 즐기는 패들보드',
        description: '물 위에서 즐기는 액티비티 체험입니다.',
        category: '스포츠',
        price: 55000,
        address: '서울특별시 영등포구',
        bannerImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        rating: 4.7,
        reviewCount: 76,
        createdAt: '2026-06-17T00:00:00.000Z',
        updatedAt: '2026-06-17T00:00:00.000Z',
      },
    ],
  },
};
