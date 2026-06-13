import { ReservationCount } from '@/lib/api/my-activities/type';
import { Calendar } from '../Calendar/Calendar';
import { useEffect, useState } from 'react';
import { getMyActivities } from '@/lib/api/my-activities';

export const CalendarBoard = () => {
  const [activityId, setActivityId] = useState<number | null>(null);
  const [dateDataMap, setDateDataMap] = useState<Map<string, ReservationCount>>(new Map());

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await getMyActivities();
        if (data.activities.length > 0) {
          setActivityId(data.activities[0].id);
        }
      } catch {
        // 글로벌 인터셉터에서 처리
      }
    }
    fetchActivities();
  }, []);

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
