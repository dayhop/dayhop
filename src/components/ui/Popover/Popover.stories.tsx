import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Popover, usePopover } from './Popover';
import EditIcon2 from '@/assets/icon/EditIcon2.svg';

const meta = {
  title: 'Components/UI/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="flex h-40 w-60 items-start justify-end">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

// 1. 기본 사용 — 기본 케밥 아이콘 트리거
export const Default: Story = {
  args: { children: null },
  render: () => (
    <Popover>
      <Popover.Content className="top-full right-0 w-[220px] rounded-xl bg-white p-6 shadow-lg">
        <p className="text-text-secondary text-sm">어떤 내용이든 자유롭게 들어갈 수 있습니다.</p>
      </Popover.Content>
    </Popover>
  ),
};

// 2. 커스텀 Trigger & 스타일링
export const CustomTrigger: Story = {
  args: { children: null },
  render: () => (
    <Popover trigger={<EditIcon2 />} ariaLabel="옵션 메뉴 열기">
      <Popover.Content className="top-full right-0 mt-2 w-30 rounded-xl border border-gray-200 bg-white p-2 shadow-md">
        <button type="button" className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
          수정하기
        </button>
        <button type="button" className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
          삭제하기
        </button>
      </Popover.Content>
    </Popover>
  ),
};

// 3. usePopover — 내부 컨텍스트로 닫기 제어
const CloseButton = () => {
  const { close } = usePopover();
  return (
    <button
      type="button"
      onClick={close}
      className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50"
    >
      닫기
    </button>
  );
};

export const WithUsePopover: Story = {
  args: { children: null },
  render: () => (
    <Popover>
      <Popover.Content className="top-full right-0 mt-2 w-35 rounded-xl border border-gray-200 bg-white p-2 shadow-md">
        <button type="button" className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
          수정하기
        </button>
        <CloseButton />
      </Popover.Content>
    </Popover>
  ),
};
