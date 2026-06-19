'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ActivityCard } from '@/components/blocks/Main/ActivityCard';
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
      const res = await getActivities({
        method: 'offset',
        sort: 'latest',
        page: 1,
        size: 3,
      });

      setActivities(res.success ? res.data.activities : []);
      setIsLoading(false);
    };

    fetchLatestActivities();
  }, [initialActivities]);

  return (
    <section className="w-full max-w-300">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">🔥 최신 체험</h2>

        <Link href="/activities" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          전체보기
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-45 w-full animate-pulse rounded-2xl bg-gray-200 md:h-96"
            />
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} data={activity} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500">등록된 최신 체험이 없습니다.</div>
      )}
    </section>
  );
}
