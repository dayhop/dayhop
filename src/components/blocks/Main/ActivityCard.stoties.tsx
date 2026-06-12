import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActivityCard } from './ActivityCard';

const meta: Meta<typeof ActivityCard> = {
  title: 'Components/Blocks/Main/ActivityCard',
  component: ActivityCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityCard>;

export const Default: Story = {
  args: {
    data: {
      title: '제주 애월 오션뷰 감성 숙소',
      price: 150000,
      bannerImageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuiufWAvE6TIiVy0mbf8Fy7yK_iCPLwsp1Eg&s',
      rating: 4.8,
      reviewCount: 128,
    },
  },
};
