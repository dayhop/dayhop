import { useEffect, useState } from 'react';

type Holiday = {
  name: string;
  date: string; // YYYY-MM-DD
};

export const useKoreanHolidays = (year: number, monthIndex: number) => {
  const [holidays, setHolidays] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHolidays = async () => {
      try {
        const monthValue = String(monthIndex + 1).padStart(2, '0');
        const response = await fetch(`/api/holidays?year=${year}&month=${monthValue}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('공휴일 조회 실패');

        const data: Holiday[] = await response.json();

        if (!Array.isArray(data)) throw new Error('공휴일 응답 데이터가 배열 형식이 아닙니다.');

        setHolidays(data.map((holiday) => holiday.date));
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('공휴일 조회 실패', error);
        setHolidays([]);
      }
    };

    fetchHolidays();

    return () => controller.abort();
  }, [year, monthIndex]);

  return holidays;
};
