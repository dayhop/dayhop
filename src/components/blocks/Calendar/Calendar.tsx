type CalendarDateInfo = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isHoliday: boolean;
};

type CalendarProps = {
  value?: Date;
  defaultMonth?: Date;
  onSelectDate?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  holidays?: string[];
  renderDateCell?: (dateInfo: CalendarDateInfo) => React.ReactNode;
};

export const Calendar = () => {};
