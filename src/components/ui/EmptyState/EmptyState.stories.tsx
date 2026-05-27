import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Components/UI/EmptyState", 
  component: EmptyState,            
  tags: ["autodocs"],                
  argTypes: {
    message: {
      control: "text",              
      description: "화면에 노출할 비어 있음 안내 메시지",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

//체험관리 페이지에서 요소가 없을때
export const Default: Story = {
  args: {
    message: "아직 등록한 체험이 없어요",
  },
};

//예약 페이지에서 요소가 없을때
export const NoReservations: Story = {
  args: {
    message: "아직 예약한 체험이 없어요",
  },
};
