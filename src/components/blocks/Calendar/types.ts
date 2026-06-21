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
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  headerTitle?: React.ReactNode;
  selectableMonths?: string[]; // "YYYY-MM" 형식, 제공 시 헤더에 년/월 select 표시
  holidays?: string[];
  renderDateCell?: (dateInfo: CalendarDateInfo) => React.ReactNode;
  renderDateExtra?: (dateInfo: CalendarDateInfo) => React.ReactNode;
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
  clickableDateClassName?: string;
  clickableDateCellClassName?: string;
};

export type CalendarHeaderProps = {
  currentMonth: Date;
  title?: React.ReactNode;
  variant?: CalendarHeaderVariant;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthSelect?: (date: Date) => void;
  selectableMonths?: string[]; // "YYYY-MM" 형식
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  labelClassName?: string;
  navigationClassName?: string;
};
