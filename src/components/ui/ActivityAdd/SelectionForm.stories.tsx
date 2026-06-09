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
    label: '카테고리',
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

export const StartTime: Story = {
  args: {
    label: '시작 시간',
    onSelectCategory: (time) => {
      console.log('선택된 시간:', time);
    },
    list: [
      '6:00',
      '7:00',
      '8:00',
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
      '00:00',
    ],
    defaultMessage: '0:00',
  },
};
