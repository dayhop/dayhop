'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ActivityCard } from '@/components/blocks/Main/ActivityCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getActivities } from '@/lib/api/activities';

import type { ActivityItem } from '@/lib/api/activities/type';

interface LatestActivitiesProps {
  activities?: ActivityItem[];
}

export function LatestActivities({ activities: initialActivities }: LatestActivitiesProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities ?? []);
  const [isLoading, setIsLoading] = useState(!initialActivities);

  useEffect(() => {
    if (initialActivities) return;

    const fetchLatestActivities = async () => {
      try {
        const res = await getActivities({
          method: 'offset',
          sort: 'latest',
          page: 1,
          size: 3,
        });

        setActivities(res.success ? res.data.activities : []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestActivities();
  }, [initialActivities]);

  if (isLoading) {
    return null;
  }

  return (
    <section className="flex max-w-300 flex-col gap-4">
      <div className="flex justify-between">
        <div className="text-lg font-bold md:text-4xl">🔥 최신 체험</div>

        <Link href="/activities" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          전체보기
        </Link>
      </div>

      {!activities.length ? (
        <EmptyState message="등록된 최신 체험이 없습니다." />
      ) : (
        <div className="flex scrollbar-none gap-4 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} data={activity} />
          ))}
        </div>
      )}
    </section>
  );
}
