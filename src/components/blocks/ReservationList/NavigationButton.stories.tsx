import { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NavigationButton, ReservationFilterButton } from './NavigationButton';
import { useState } from 'react';

const meta: Meta<typeof NavigationButton> = {
  title: 'Components/Blocks/NavigationButton',
  component: NavigationButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof NavigationButton>;

export const Default: Story = {
  render: (args) => {
    const [activeStatus, setActiveStatus] = useState<ReservationFilterButton>('all');

    return (
      <NavigationButton
        {...args}
        activeStatus={activeStatus}
        onClickButton={(button) => {
          setActiveStatus(button);
          console.log(button);

          if (args.onClickButton) {
            args.onClickButton(button);
          }
        }}
      />
    );
  },
};
