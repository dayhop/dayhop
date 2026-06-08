import { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NavigationButton, ReservationStatus } from './NavigationButton';
import { useState } from 'react';

const meta: Meta<typeof NavigationButton> = {
  title: 'components/UI/NavigationButton',
  component: NavigationButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof NavigationButton>;

export const Default: Story = {
  args: {
    activeStatus: '전체 조회',
  },

  render: (args) => {
    const [activeStatus, setActiveStatus] = useState<ReservationStatus>(args.activeStatus);

    return (
      <NavigationButton
        {...args}
        activeStatus={activeStatus}
        onClickButton={(button) => {
          setActiveStatus(button);

          if (args.onClickButton) {
            args.onClickButton(button);
          }
        }}
      />
    );
  },
};
