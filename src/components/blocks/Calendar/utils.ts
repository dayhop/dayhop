export function isPastTime(date: string, endTime: string): boolean {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = endTime.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute) < new Date();
}

export const toLocalDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const getCalendarDates = (year: number, month: number) => {
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  const firstDay = firstDate.getDay();
  const lastDay = lastDate.getDay();

  const startDate = new Date(year, month, 1 - firstDay);
  const totalDays = firstDay + lastDate.getDate() + (6 - lastDay);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
};
