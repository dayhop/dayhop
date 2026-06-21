/**
 * 기준 월로부터 앞뒤로 선택 가능한 월 목록을 "YYYY-MM" 형식으로 생성합니다.
 * @param monthsBefore 기준 월 이전 개월 수 (기본값: 12)
 * @param monthsAfter  기준 월 이후 개월 수 (기본값: 12)
 */
export function buildSelectableMonths(monthsBefore = 12, monthsAfter = 12): string[] {
  const today = new Date();
  const months: string[] = [];
  for (let i = -monthsBefore; i <= monthsAfter; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

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
