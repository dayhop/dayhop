import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StarRating } from './StarRating';

const meta: Meta<typeof StarRating> = {
  title: 'Components/UI/StarRating',
  component: StarRating,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['display', 'interactive'],
      description: '별점 컴포넌트의 모드 (표시용 / 입력용)',
    },
    rating: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: '현재 별점 값',
    },
    reviewCount: {
      control: 'number',
      description: '리뷰 개수 (display 모드에서 노출)',
    },
    maxStars: {
      control: { type: 'number', min: 1, max: 10 },
      description: '표시할 총 별 개수 (interactive 모드 기본값: 5)',
    },
    onChange: {
      action: 'onChange',
      description: '별점 변경 시 호출되는 콜백 함수 (interactive 모드)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const DisplayMode: Story = {
  args: {
    mode: 'display',
    rating: 4.3,
    reviewCount: 128,
  },
};

export const DisplayModeWithoutReviews: Story = {
  args: {
    mode: 'display',
    rating: 4.8,
  },
};

export const InteractiveMode: Story = {
  args: {
    mode: 'interactive',
    rating: 3,
    maxStars: 5,
  },
};
