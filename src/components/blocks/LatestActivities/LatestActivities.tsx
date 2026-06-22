'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ActivityCard } from '@/components/blocks/Main/ActivityCard';
import { ActivityCardSkeleton } from '@/components/blocks/Main/ActivityCardSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { getActivities } from '@/lib/api/activities';

import type { ActivityItem } from '@/lib/api/activities/type';
import { ActivityCardContainer } from '../Main/ActivityCardContainer';

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
          size: 4,
        });

        setActivities(res.success ? res.data.activities : []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestActivities();
  }, [initialActivities]);

  if (isLoading) {
    return (
      <section className="flex max-w-300 flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-lg font-bold md:text-4xl">🔥 최신 체험</div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <ActivityCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }
  if (!activities.length) {
    return (
      <section className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
        <div className="text-xl font-bold md:text-2xl">🔥 최신 체험</div>

        <div className="py-8 text-center text-sm text-gray-500">등록된 체험이 없습니다.</div>
      </section>
    );
  }

  return <ActivityCardContainer activitiesList={activities} title="🔥 최신 체험" showMore={true} />;
}
