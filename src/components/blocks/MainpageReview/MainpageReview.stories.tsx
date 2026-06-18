import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MainpageReview } from '.';

const meta = {
  title: 'Main/MainpageReview',
  component: MainpageReview,
} satisfies Meta<typeof MainpageReview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        activity: {
          id: 1,
          userId: 1,
          title: '도자기 공방 체험',
          description: '',
          category: '문화 · 예술',
          price: 30000,
          address: '서울',
          bannerImageUrl: 'https://picsum.photos/300/400',
          rating: 4.8,
          reviewCount: 12,
          createdAt: '',
          updatedAt: '',
        },
        review: {
          id: 1,
          activityId: 1,
          rating: 5,
          content: '도자기 만들기를 직접 체험해볼 수 있어서 좋았습니다.',
          createdAt: '',
          updatedAt: '',
          user: {
            id: 1,
            nickname: 'bes****',
            profileImageUrl: 'https://picsum.photos/100',
          },
        },
      },
      {
        activity: {
          id: 2,
          userId: 1,
          title: '서울 야경 투어',
          description: '',
          category: '투어',
          price: 25000,
          address: '서울',
          bannerImageUrl: 'https://picsum.photos/301/400',
          rating: 4.9,
          reviewCount: 10,
          createdAt: '',
          updatedAt: '',
        },
        review: {
          id: 2,
          activityId: 2,
          rating: 4.5,
          content: '야경이 정말 예뻤고 가이드 설명도 만족스러웠습니다.',
          createdAt: '',
          updatedAt: '',
          user: {
            id: 2,
            nickname: 'hop****',
            profileImageUrl: 'https://picsum.photos/101',
          },
        },
      },
      {
        activity: {
          id: 3,
          userId: 1,
          title: '와인 클래스',
          description: '',
          category: '식음료',
          price: 50000,
          address: '성수',
          bannerImageUrl: 'https://picsum.photos/302/400',
          rating: 4.7,
          reviewCount: 8,
          createdAt: '',
          updatedAt: '',
        },
        review: {
          id: 3,
          activityId: 3,
          rating: 5,
          content: '입문자도 쉽게 이해할 수 있어서 좋았습니다.',
          createdAt: '',
          updatedAt: '',
          user: {
            id: 3,
            nickname: 'wine****',
            profileImageUrl: 'https://picsum.photos/102',
          },
        },
      },
      {
        activity: {
          id: 4,
          userId: 1,
          title: '도자기 만들기',
          description: '',
          category: '문화 · 예술',
          price: 45000,
          address: '홍대',
          bannerImageUrl: 'https://picsum.photos/303/400',
          rating: 4.9,
          reviewCount: 30,
          createdAt: '',
          updatedAt: '',
        },
        review: {
          id: 4,
          activityId: 4,
          rating: 5,
          content: '직접 만들어서 가져갈 수 있어서 의미 있었습니다.',
          createdAt: '',
          updatedAt: '',
          user: {
            id: 4,
            nickname: 'art****',
            profileImageUrl: 'https://picsum.photos/103',
          },
        },
      },
    ],
  },
};
