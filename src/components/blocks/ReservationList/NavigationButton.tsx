export type ReservationFilterButton =
  | 'pending'
  | 'confirmed'
  | 'declined'
  | 'canceled'
  | 'completed'
  | 'all';

const buttonList: ReservationFilterButton[] = [
  'all',
  'pending',
  'confirmed',
  'declined',
  'canceled',
  'completed',
];

const BUTTON_MATCH = {
  all: '전체',
  pending: '예약 완료',
  canceled: '예약 취소',
  confirmed: '예약 승인',
  declined: '예약 거절',
  completed: '체험 완료',
};

interface NavigationButtonProps {
  activeStatus: ReservationFilterButton;
  onClickButton: (button: ReservationFilterButton) => void;
}

export function NavigationButton({ activeStatus, onClickButton }: NavigationButtonProps) {
  return (
    <div className="flex scrollbar-none gap-2 overflow-scroll px-6 [-ms-overflow-style:none] md:px-0">
      {buttonList.map((button) => (
        <button
          type="button"
          key={button}
          className={`${activeStatus === button ? 'bg-text-primary text-bg' : 'text-text-primary bg-bg'} border-bg-surface h-10 w-23 shrink-0 cursor-pointer rounded-4xl border`}
          onClick={() => onClickButton(button)}
        >
          {BUTTON_MATCH[button]}
        </button>
      ))}
    </div>
  );
}
