import { Calendar } from '../Calendar/Calendar';

export const CalendarBoard = () => {
  return (
    <Calendar
      dayHeaderClassName="border-b border-border-default"
      dateClassName="border-b border-gray-50 [&:nth-last-child(-n+7)]:border-b-0"
      selectedClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
      todayClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
      holidayClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
      defaultClassName="w-[18px] h-[18px] rounded-[2px] md:w-[22px] md:h-[22px] rounded-[4px]"
    />
  );
};
