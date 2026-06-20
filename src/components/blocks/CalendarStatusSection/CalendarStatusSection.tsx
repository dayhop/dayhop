'use client';

import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { SelectField } from '@/components/ui/SelectField';
import type { ActivityItem } from '@/lib/api/my-activities/type';
import { CalendarBoard } from '../CalendarBoard';

interface CalendarStatusSectionProps {
  initialActivities: ActivityItem[];
}

export const CalendarStatusSection = ({ initialActivities }: CalendarStatusSectionProps) => {
  const [activities] = useState<ActivityItem[]>(initialActivities);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(
    initialActivities[0] ?? null
  );

  const handleSelectActivity = (title: string) => {
    const activity = activities.find((a) => a.title === title);
    if (activity) setSelectedActivity(activity);
  };

  return (
    <>
      {selectedActivity ? (
        <>
          <div className="px-6 md:px-0">
            <SelectField
              list={activities.map((activity) => activity.title)}
              onSelectOption={handleSelectActivity}
              selectedOption={selectedActivity.title}
              defaultMessage="체험을 선택해 주세요"
            />
          </div>
          <div className="mt-7.5 md:mt-6 lg:relative lg:mt-7.5">
            <CalendarBoard
              key={selectedActivity.id}
              activityId={selectedActivity.id}
              wrapperClassName="md:rounded-3xl md:bg-white md:pt-5 md:pb-2.5 md:shadow-[0_4px_24px_0_rgba(156,180,202,0.2)]"
            />
          </div>
        </>
      ) : (
        <EmptyState message="아직 등록한 체험이 없습니다." />
      )}
    </>
  );
};
