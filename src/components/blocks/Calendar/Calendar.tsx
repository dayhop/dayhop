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

const getCalendarDates = (year: number, month: number) => {
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  const firstDay = firstDate.getDay();
  const lastDay = lastDate.getDay();

  const startDate = new Date(year, month, 1 - firstDay);
  const endDate = new Date(year, month, lastDate.getDate() + (6 - lastDay));

  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDate = diffTime / (1000 * 60 * 60 * 24);

  return Array.from({ length: diffDate + 1 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
};

export const Calendar = () => {};
