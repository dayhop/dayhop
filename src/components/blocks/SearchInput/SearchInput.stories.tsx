import { SearchInput } from './SearchInput';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Blocks/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    onSearch: { action: 'searched' },
    onReset: { action: 'reset' },
    initialValue: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    initialValue: '',
  },
};

export const Prepopulated: Story = {
  args: {
    initialValue: '마포구',
  },
};
