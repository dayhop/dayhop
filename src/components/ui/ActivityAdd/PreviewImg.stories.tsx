import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PreviewImg } from './PreviewImg';

const meta: Meta<typeof PreviewImg> = {
  title: 'Components/UI/ActivityAdd/PreviewImg',
  component: PreviewImg,
  tags: ['autodocs'],
  argTypes: {
    onClickDeleteButton: { action: 'deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof PreviewImg>;

export const Default: Story = {
  args: {
    imgUrl: 'https://picsum.photos/200/300',
    onClickDeleteButton: () => alert('삭제 버튼 클릭!'),
  },
};
