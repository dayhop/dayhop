import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UploadImg } from './UploadImg';

const meta: Meta<typeof UploadImg> = {
  title: 'Components/UI/ActivityAdd/UploadImg',
  component: UploadImg,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UploadImg>;

export const Default: Story = {};
