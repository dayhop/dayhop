import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Calendar } from './Calendar';

const meta = {
  title: 'Components/Blocks/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-81.75 md:w-175">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

const holidays = ['2026-06-03', '2026-06-06'];

export const Default: Story = {
  args: {
    defaultMonth: new Date(2026, 5, 1),
    holidays,
  },
};

export const SecondaryHeader: Story = {
  args: {
    defaultMonth: new Date(2026, 5, 1),
    headerVariant: 'secondary',
    holidays,
  },
};

export const DisabledPastDates: Story = {
  args: {
    defaultMonth: new Date(),
    isDateDisabled: (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      return targetDate < today;
    },
  },
};

// 비제어 모드 — defaultValue로 초기 선택값 지정, 부모 useState 불필요
export const WithDefaultValue: Story = {
  args: {
    defaultValue: new Date(2026, 5, 15),
    defaultMonth: new Date(2026, 5, 1),
    holidays,
  },
};

// 제어 모드 — 부모가 value를 들고 있어 선택된 날짜를 외부에서 활용 가능
export const Interactive: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date>();

    return (
      <>
        <Calendar
          value={selectedDate}
          defaultMonth={new Date(2026, 5, 1)}
          holidays={holidays}
          onSelectDate={(date) => {
            setSelectedDate(date);
          }}
        />

        {selectedDate && (
          <p className="mt-4">선택한 날짜: {selectedDate.toLocaleDateString('ko-KR')}</p>
        )}
      </>
    );
  },
};
