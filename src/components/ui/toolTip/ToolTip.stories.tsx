import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToolTip } from './ToolTip';

const meta = {
  title: 'Components/ToolTip',
  component: ToolTip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'radio',
      options: ['left', 'right'],
      description: '툴팁 박스의 가로 뻗는 방향',
    },
    placement: {
      control: 'radio',
      options: ['top', 'bottom'],
      description: '타겟 요소를 기준으로 툴팁이 위치할 상하 방향',
    },
    message: {
      control: 'text',
      description: '툴팁에 표시될 내용',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex h-64 w-full min-w-[300px] items-center justify-center rounded-lg border border-dashed border-gray-300">
        <div id="storybook-tooltip-target" className="h-10 w-10 rounded-md bg-gray-400"></div>
        <Story />
      </div>
    ),
  ],
  args: {
    targetId: 'storybook-tooltip-target',
    message: '내 주변의 여행 정보를 한 눈에 볼 수 있어요.',
  },
} satisfies Meta<typeof ToolTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    align: 'right',
    placement: 'bottom',
  },
};

export const TopLeft: Story = {
  args: {
    align: 'left',
    placement: 'top',
  },
};

export const BottomLeft: Story = {
  args: {
    align: 'left',
    placement: 'bottom',
  },
};

export const TopRight: Story = {
  args: {
    align: 'right',
    placement: 'top',
  },
};

export const BottomRight: Story = {
  args: {
    align: 'right',
    placement: 'bottom',
  },
};
