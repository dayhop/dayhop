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
      <section className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
        <div className="text-xl font-bold md:text-2xl">🛼 인기 체험</div>

        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 w-42 shrink-0 animate-pulse rounded-2xl bg-gray-200 md:h-80 md:w-80"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!activities.length) {
    return (
      <section className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
        <div className="text-xl font-bold md:text-2xl">🛼 인기 체험</div>

        <div className="py-8 text-center text-sm text-gray-500">등록된 체험이 없습니다.</div>
      </section>
    );
  }

  return <ActivityCardContainer activitiesList={activities} title="🛼 인기 체험" />;
}
