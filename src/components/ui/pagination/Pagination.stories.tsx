import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    clickPrev: { action: 'clicked previous' },
    clickNext: { action: 'clicked next' },
    clickPage: { action: 'clicked page' },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const FirstPage: Story = {
  args: {
    paginationCount: 5,
    currentPage: 1,
  },
};

export const LastPage: Story = {
  args: {
    paginationCount: 5,
    currentPage: 5,
  },
};

export const LessThanFive: Story = {
  args: {
    paginationCount: 3,
    currentPage: 2,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        clickPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        clickNext={() => setCurrentPage((prev) => Math.min(prev + 1, args.paginationCount))}
        clickPage={(page) => setCurrentPage(page)}
      />
    );
  },
  args: {
    paginationCount: 10,
  },
};
