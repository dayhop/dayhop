import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';
import { StarRating } from './StarRating';

const meta: Meta<typeof StarRating> = {
  title: 'Components/UI/StarRating',
  component: StarRating,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['display', 'interactive'],
      description: '작동 모드 설정 (단순 표시용 vs 평점 입력용)',
    },
    rating: {
      control: { type: 'number', min: 0, max: 5 },
      description: '현재 평점 값',
    },
    reviewCount: {
      control: 'number',
      description: '(display 모드 전용) 리뷰 참여 인원 수',
    },
    maxStars: {
      control: { type: 'number', min: 1, max: 10 },
      description: '(interactive 모드 전용) 총 별 개수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Display: Story = {
  args: {
    mode: 'display',
    rating: 4.9,
    reviewCount: 100,
  },
};

export const InteractiveStatic: Story = {
  args: {
    mode: 'interactive',
    rating: 3,
  },
};

export const InteractivePlayground: Story = {
  render: (args) => {
    const [currentRating, setCurrentRating] = useState(3);
    return (
      <div className="flex flex-col gap-2">
        <StarRating {...args} rating={currentRating} onChange={setCurrentRating} />
        <p className="text-sm font-medium text-gray-500">
          현재 마우스로 클릭해서 선택한 별점:{' '}
          <span className="font-bold text-gray-900">{currentRating}점</span>
        </p>
      </div>
    );
  },
  args: {
    mode: 'interactive',
  },
};
