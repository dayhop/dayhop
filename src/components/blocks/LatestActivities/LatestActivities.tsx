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

  useEffect(() => {
    if (initialActivities) return;

    const fetchLatestActivities = async () => {
      try {
        const data = await getActivities({
          method: 'offset',
          sort: 'latest',
          page: 1,
          size: 3,
        });

        setActivities(data.activities);
      } catch {
        setActivities([]);
      }
    };

    fetchLatestActivities();
  }, [initialActivities]);

  if (!activities.length) {
    return <div className="text-sm text-gray-500">최신 체험이 없습니다.</div>;
  }

  return (
    <section className="w-full max-w-300">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold md:text-4xl">🔥 최신 체험</h2>

        <Link href="/activities" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          전체보기
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} data={activity} />
        ))}
      </div>
    </section>
  );
}
