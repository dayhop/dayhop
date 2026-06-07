import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NavigationButton } from './NavigationButton';

const meta: Meta<typeof NavigationButton> = {
  title: 'UI/components/NavigationButton',
  component: NavigationButton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof NavigationButton>;
export const Default: Story = {};
