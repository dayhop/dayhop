import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
#### Avatar

- src가 없으면 기본 아바타 이미지가 표시됩니다.
- size는 sm, md, lg를 지원합니다.

#### Size
- sm: 모바일 20px / md 이상 24px
- md: 30px
- lg: 모바일 70px / md 이상 120px

#### 기타
- 필요 시 className으로 스타일을 확장할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '아바타 크기',
    },
    src: {
      description: '프로필 이미지 URL',
    },
    className: {
      description: '추가 스타일 클래스',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

//src 이미지가 없을 경우
export const Default: Story = {
  args: {
    size: 'md',
  },
};

//src 이미지가 있을 경우
export const WithSrcImage: Story = {
  args: {
    src: '@/assets/images/avatar-sample.jpg',
  },
};

// Small 사이즈 (767px이하: 20px / 768px이상: 24px)
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

// Medium 사이즈 (30px)
export const Medium: Story = {
  args: {
    size: 'md',
  },
};

// Large 사이즈 (767px이하: 70px / 768px이상: 120px)
export const Large: Story = {
  args: {
    size: 'lg',
  },
};
