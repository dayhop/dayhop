import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BestActivities } from './BestActivities';

import type { ActivityItem } from '@/lib/api/activities/type';

const mockActivities = [
  {
    id: 1,
    userId: 1,
    title: '서울 야경 투어',
    category: '투어' as ActivityItem['category'],
    description: '스토리북용 데이터',
    price: 30000,
    address: '서울특별시 강남구',
    bannerImageUrl: 'https://picsum.photos/400/400?1',
    rating: 4.8,
    reviewCount: 128,
    createdAt: '2026-06-17T00:00:00.000Z',
    updatedAt: '2026-06-17T00:00:00.000Z',
  },
  {
    id: 2,
    userId: 1,
    title: '한강 자전거 체험',
    category: '스포츠' as ActivityItem['category'],
    description: '스토리북용 데이터',
    price: 25000,
    address: '서울특별시 영등포구',
    bannerImageUrl: 'https://picsum.photos/400/400?2',
    rating: 4.9,
    reviewCount: 95,
    createdAt: '2026-06-17T00:00:00.000Z',
    updatedAt: '2026-06-17T00:00:00.000Z',
  },
  {
    id: 3,
    userId: 1,
    title: '전통 공예 클래스',
    category: '문화 · 예술' as ActivityItem['category'],
    description: '스토리북용 데이터',
    price: 45000,
    address: '서울특별시 종로구',
    bannerImageUrl: 'https://picsum.photos/400/400?3',
    rating: 4.7,
    reviewCount: 76,
    createdAt: '2026-06-17T00:00:00.000Z',
    updatedAt: '2026-06-17T00:00:00.000Z',
  },
  {
    id: 4,
    userId: 1,
    title: '브런치 쿠킹 클래스',
    category: '식음료' as ActivityItem['category'],
    description: '스토리북용 데이터',
    price: 55000,
    address: '서울특별시 마포구',
    bannerImageUrl: 'https://picsum.photos/400/400?4',
    rating: 4.6,
    reviewCount: 102,
    createdAt: '2026-06-17T00:00:00.000Z',
    updatedAt: '2026-06-17T00:00:00.000Z',
  },
] as ActivityItem[];

const meta = {
  title: 'Blocks/BestActivities',
  component: BestActivities,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof BestActivities>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: mockActivities,
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
