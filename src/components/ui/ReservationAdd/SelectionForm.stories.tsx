import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SelectionForm } from './SelectionForm';

const meta: Meta<typeof SelectionForm> = {
  title: 'Components/UI/ReservationAdd/SelectionForm',
  component: SelectionForm,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelectCategory: (category) => {
      console.log('선택된 카테고리:', category);
    },

    list: ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'],
    selectOption: '웰빙',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '300px', maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};
