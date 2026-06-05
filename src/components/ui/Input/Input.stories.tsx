import Input from './Input';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import SearchIcon from '@/assets/icon/SettingIcon.svg';
import EyeIcon from '@/assets/icon/UserIcon.svg';

const meta: Meta<typeof Input> = {
  title: 'Components/UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    isWarning: { control: 'boolean' },
    disabled: { control: 'boolean' },
    warningText: { control: 'text' },
    prefix: { control: false },
    suffix: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: '이메일을 입력해 주세요',
    className: 'w-80',
  },
};

export const Warning: Story = {
  args: {
    placeholder: '이메일을 입력해 주세요',
    className: 'w-80',
    isWarning: true,
    warningText: '잘못된 이메일입니다.',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '이메일을 입력해 주세요',
    className: 'w-80',
    disabled: true,
  },
};

export const WithPrefix: Story = {
  args: {
    placeholder: '내가 원하는 체험은',
    className: 'w-80',
    prefix: <SearchIcon width={20} height={20} />,
  },
};

export const WithSuffix: Story = {
  args: {
    placeholder: '비밀번호를 한 번 더 입력해 주세요',
    className: 'w-80',
    suffix: <EyeIcon width={20} height={20} />,
  },
};

export const Password: Story = {
  args: {
    placeholder: '비밀번호를 입력해 주세요',
    className: 'w-80',
    type: 'password',
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    placeholder: '내가 원하는 체험은',
    className: 'w-80',
    prefix: <SearchIcon width={20} height={20} />,
    suffix: (
      <button className="rounded-xl bg-blue-400 px-3 py-1 text-sm text-white">검색하기</button>
    ),
  },
};
