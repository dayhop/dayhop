'use client';

import { useEffect, useState } from 'react';

import { ActivityCardContainer } from '@/components/blocks/Main/ActivityCardContainer';
import { EmptyState } from '@/components/ui/EmptyState';
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
      try {
        const res = await getActivities({
          method: 'offset',
          sort: 'most_reviewed',
          page: 1,
          size: 10,
        });

        setActivities(res.success ? res.data.activities : []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestActivities();
  }, [items]);

  if (isLoading) {
    return null;
  }

  if (!activities.length) {
    return (
      <section className="flex w-full max-w-300 flex-col gap-4">
        <h2 className="text-lg font-bold md:text-4xl">🛼 인기 체험</h2>
        <EmptyState message="등록된 체험이 없습니다." />
      </section>
    );
  }

  return <ActivityCardContainer activitiesList={activities} title="🛼 인기 체험" />;
}
