import { useEffect, useState } from 'react';

type Holiday = {
  name: string;
  date: string; // YYYY-MM-DD
};

export const useKoreanHolidays = (year: number, month: number) => {
  const [holidays, setHolidays] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchHolidays = async () => {
      try {
        const monthValue = String(month + 1).padStart(2, '0');

        const response = await fetch(`/api/holidays?year=${year}&month=${monthValue}`);

        if (!response.ok) {
          throw new Error('공휴일 조회 실패');
        }

        const data: Holiday[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('공휴일 응답 데이터가 배열 형식이 아닙니다.');
        }

        if (isMounted) {
          setHolidays(data.map((holiday) => holiday.date));
        }
      } catch (error) {
        console.error('공휴일 조회 실패', error);

        if (isMounted) {
          setHolidays([]);
        }
      }
    };

    fetchHolidays();

    return () => {
      isMounted = false;
    };
  }, [year, month]);

  return holidays;
};
