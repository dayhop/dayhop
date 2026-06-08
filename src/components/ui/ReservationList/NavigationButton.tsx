export type ReservationStatus =
  | '전체 조회'
  | '예약 완료'
  | '예약 취소'
  | '예약 승인'
  | '예약 거절'
  | '체험 완료';

const buttonList: ReservationStatus[] = [
  '전체 조회',
  '예약 완료',
  '예약 취소',
  '예약 승인',
  '예약 거절',
  '체험 완료',
];

interface NavigationButtonProps {
  activeStatus: ReservationStatus;
  onClickButton: (button: ReservationStatus) => void;
}

export function NavigationButton({ activeStatus, onClickButton }: NavigationButtonProps) {
  return (
    <div className="flex scrollbar-none gap-2 overflow-scroll [-ms-overflow-style:none]">
      {buttonList.map((button) => (
        <button
          key={button}
          value={button}
          className={`${activeStatus === button ? 'bg-black text-white' : 'bg-white text-black'} h-10 w-23 shrink-0 cursor-pointer rounded-4xl border border-[#d8d8d8]`}
          onClick={() => onClickButton(button)}
        >
          {button}
        </button>
      ))}
    </div>
  );
}
