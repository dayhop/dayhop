'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { SelectField } from '@/components/ui/SelectField';
import { getMyActivities } from '@/lib/api/my-activities';
import type { ActivityItem } from '@/lib/api/my-activities/type';
import { CalendarBoard } from '../CalendarBoard';

export const CalendarStatusSection = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await getMyActivities();
        setActivities(data.activities);
        if (data.activities.length > 0) {
          setSelectedActivity(data.activities[0]);
        }
      } catch {
        // 글로벌 인터셉터에서 처리
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <>
      {!isLoading &&
        (selectedActivity ? (
          <>
            <SelectField
              list={activities.map((activity) => activity.title)}
              onSelectOption={(title) => {
                const activity = activities.find((activity) => activity.title === title);
                if (activity) setSelectedActivity(activity);
              }}
              selectedOption={selectedActivity?.title ?? ''}
              defaultMessage="체험을 선택해 주세요"
            />
            <div className="mt-7.5 md:mt-6 lg:relative lg:mt-7.5">
              <CalendarBoard
                key={selectedActivity.id}
                activityId={selectedActivity.id}
                wrapperClassName="md:rounded-3xl md:bg-white md:pt-5 md:pb-2.5 md:shadow-[0_4px_24px_0_rgba(156,180,202,0.2)]"
              />
            </div>
          </>
        ) : (
          <EmptyState message="아직 등록한 체험이 없어요" />
        ))}
    </>
  );
};
