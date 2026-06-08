import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BannerCarousel } from './BannerCarousel';

const meta = {
  title: 'UI/BannerCarousel',
  component: BannerCarousel,
} satisfies Meta<typeof BannerCarousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[1200px]">
      <BannerCarousel {...args} />
    </div>
  ),
  args: {
    activities: [
      {
        id: 1,
        userId: 1,
        title: '여행 떠나기 좋은 날',
        description: '',
        category: '투어',
        price: 30000,
        address: '국내숙소 18만원 쿠폰팩',
        bannerImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        rating: 4.8,
        reviewCount: 100,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 2,
        userId: 1,
        title: '제주도 힐링 여행',
        description: '',
        category: '관광',
        price: 50000,
        address: '제주 인기 숙소 할인',
        bannerImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        rating: 4.8,
        reviewCount: 100,
        createdAt: '',
        updatedAt: '',
      },
    ],
  },
};
