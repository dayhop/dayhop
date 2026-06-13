export type CalendarHeaderVariant = 'default' | 'secondary';

export type CalendarDateInfo = {
  date: Date;
  dateNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isHoliday: boolean;
  isSunday: boolean;
};

export type CalendarProps = {
  value?: Date;
  defaultValue?: Date;
  defaultMonth?: Date;
  onSelectDate?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  holidays?: string[];
  renderDateCell?: (dateInfo: CalendarDateInfo) => React.ReactNode;
  isDateDisabled?: (date: Date) => boolean;
  isDateClickable?: (date: Date) => boolean;
  headerVariant?: CalendarHeaderVariant;
  className?: string;
  headerClassName?: string;
  headerContentClassName?: string;
  headerTitleClassName?: string;
  headerLabelClassName?: string;
  headerNavigationClassName?: string;
  dayHeaderClassName?: string;
  dayClassName?: string;
  dateClassName?: string;
  dateCellClassName?: string;
  todayClassName?: string;
  selectedClassName?: string;
  holidayClassName?: string;
  defaultClassName?: string;
  pointClassName?: string;
  isDatePoint?: (date: Date) => boolean;
};

export type CalendarHeaderProps = {
  currentMonth: Date;
  variant?: CalendarHeaderVariant;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  labelClassName?: string;
  navigationClassName?: string;
};
