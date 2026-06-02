import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Popover } from './Popover';

const meta = {
  title: 'Components/UI/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        label: '수정하기',
        onClick: () => alert('수정'),
      },
      {
        label: '삭제하기',
        onClick: () => alert('삭제'),
        variant: 'delete',
      },
    ],
  },
  render: (args) => (
    <div className="ml-50 h-30">
      <Popover {...args} />
    </div>
  ),
};

import EditIcon from '@/assets/icon/EditIcon.svg';
import DeleteIcon from '@/assets/icon/DeleteIcon.svg';
export const WithIcon: Story = {
  args: {
    items: [
      {
        label: '수정하기',
        icon: <EditIcon />,
        onClick: () => alert('수정'),
      },
      {
        label: '삭제하기',
        icon: <DeleteIcon />,
        onClick: () => alert('삭제'),
        variant: 'delete',
      },
    ],
  },
  render: (args) => (
    <div className="ml-50 h-30">
      <Popover {...args} />
    </div>
  ),
};

import EditIcon2 from '@/assets/icon/EditIcon2.svg';
export const CustomTrigger: Story = {
  args: {
    trigger: <EditIcon2 />,
    menuClassName: 'right-auto left-[calc(100%+10px)] top-auto bottom-0',
    items: [
      {
        label: '수정하기',
        icon: <EditIcon />,
        onClick: () => alert('수정'),
      },
      {
        label: '삭제하기',
        icon: <DeleteIcon />,
        onClick: () => alert('삭제'),
        variant: 'delete',
      },
    ],
  },
  render: (args) => (
    <div className="mt-20 ml-50">
      <Popover {...args} />
    </div>
  ),
};
