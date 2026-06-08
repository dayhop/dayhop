import { useEffect, useState } from 'react';

type Holiday = {
  name: string;
  date: string; // YYYY-MM-DD
};

export const useKoreanHolidays = (year: number, month: number) => {
  const [holidays, setHolidays] = useState<string[]>([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      const monthValue = String(month + 1).padStart(2, '0');

      const response = await fetch(`/api/holidays?year=${year}&month=${monthValue}`);
      const data: Holiday[] = await response.json();

      setHolidays(data.map((holiday) => holiday.date));
    };

    fetchHolidays();
  }, [year, month]);

  return holidays;
};
