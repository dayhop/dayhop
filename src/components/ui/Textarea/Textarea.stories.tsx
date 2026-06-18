import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;
type TextareaProps = React.ComponentProps<typeof Textarea>;

const ControlledTextarea = (args: TextareaProps) => {
  const [value, setValue] = useState('');

  return <Textarea {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

//textarea - default : 체험 등록/수정 폼에서 사용
export const Default: Story = {
  args: {
    variant: 'default',
    label: '설명',
    placeholder: '체험에 대한 설명을 입력해 주세요',
  },
};

//textarea - review : 리뷰 작성하기 모달에서 사용
export const Review: Story = {
  render: (args) => <ControlledTextarea {...args} />,
  args: {
    variant: 'review',
    label: '소중한 경험을 들려주세요',
    placeholder: '체험에서 느낀 경험을 자유롭게 남겨주세요',
    maxLength: 100,
    showCount: true,
  },
};
