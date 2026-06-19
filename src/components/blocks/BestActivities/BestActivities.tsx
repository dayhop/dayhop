'use client';

import { useEffect, useState } from 'react';

import { ActivityCardContainer } from '@/components/blocks/Main/ActivityCardContainer';
import { getActivities } from '@/lib/api/activities';

import type { ActivityItem } from '@/lib/api/activities/type';

interface BestActivitiesProps {
  items?: ActivityItem[];
}

export function BestActivities({ items }: BestActivitiesProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(items ?? []);
  const [isLoading, setIsLoading] = useState(!items);

  useEffect(() => {
    if (items) return;

    const fetchBestActivities = async () => {
      const res = await getActivities({
        method: 'offset',
        sort: 'most_reviewed',
        page: 1,
        size: 10,
      });

      setActivities(res.success ? res.data.activities : []);
      setIsLoading(false);
    };

    fetchBestActivities();
  }, [items]);

  if (isLoading) {
    return (
      <section className="flex w-full max-w-300 flex-col gap-8">
        <div className="text-2xl font-bold md:text-3xl">🛼 인기 체험</div>

        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-45 w-46.5 shrink-0 animate-pulse rounded-2xl bg-gray-200 md:h-96 md:w-96"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!activities.length) {
    return (
      <section className="flex w-full max-w-300 flex-col gap-8">
        <div className="text-2xl font-bold md:text-3xl">🛼 인기 체험</div>

        <div className="py-10 text-center text-gray-500">등록된 체험이 없습니다.</div>
      </section>
    );
  }

  return <ActivityCardContainer activitiesList={activities} title="🛼 인기 체험" />;
}
