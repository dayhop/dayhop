import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import MainpageLatest from './MainpageLatest';

const CATEGORIES = ['문화 · 예술', '식음료', '스포츠', '투어', '관광'];

const MOCK_DATA = Array.from({ length: 20 }).map((_, index) => ({
  id: index + 1,
  title: `도자기 만들기 공방 체험 ${index + 1}`,
  category: CATEGORIES[index % CATEGORIES.length],
  price: 35000,
  rating: 4.8,
  reviewCount: 15,
  imageUrl: 'https://picsum.photos/400/400',
}));

const meta = {
  title: 'Blocks/MainpageLatest',
  component: MainpageLatest,
  tags: ['autodocs'],
} satisfies Meta<typeof MainpageLatest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: MOCK_DATA,
  },
};
