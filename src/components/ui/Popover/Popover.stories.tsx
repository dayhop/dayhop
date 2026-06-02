import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Popover, PopoverItem } from './Popover';
import EditIcon from '@/assets/icon/EditIcon.svg';
import DeleteIcon from '@/assets/icon/DeleteIcon.svg';
import EditIcon2 from '@/assets/icon/EditIcon2.svg';

const meta = {
  title: 'Components/UI/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: (args) => (
    <div className="ml-50 h-30">
      <Popover {...args}>
        <PopoverItem onClick={() => alert('수정')}>수정하기</PopoverItem>
        <PopoverItem variant="delete" onClick={() => alert('삭제')}>
          삭제하기
        </PopoverItem>
      </Popover>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: null,
  },
  render: (args) => (
    <div className="ml-50 h-30">
      <Popover {...args}>
        <PopoverItem icon={<EditIcon />} onClick={() => alert('수정')}>
          수정하기
        </PopoverItem>
        <PopoverItem icon={<DeleteIcon />} variant="delete" onClick={() => alert('삭제')}>
          삭제하기
        </PopoverItem>
      </Popover>
    </div>
  ),
};

export const CustomTrigger: Story = {
  args: {
    trigger: <EditIcon2 />,
    menuClassName: 'right-auto left-[calc(100%+10px)] top-auto bottom-0',
    children: null,
  },
  render: (args) => (
    <div className="mt-20 ml-50">
      <Popover {...args}>
        <PopoverItem icon={<EditIcon />} onClick={() => alert('수정')}>
          수정하기
        </PopoverItem>
        <PopoverItem icon={<DeleteIcon />} variant="delete" onClick={() => alert('삭제')}>
          삭제하기
        </PopoverItem>
      </Popover>
    </div>
  ),
};
