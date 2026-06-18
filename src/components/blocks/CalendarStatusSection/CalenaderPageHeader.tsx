export const CalendarPageHeader = () => {
  return (
    <div className="mb-10 flex items-center justify-between">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-text-primary text-lg leading-[1.2] font-bold">예약 현황</h2>
        <p className="text-text-tertiary text-sm font-medium">
          내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
