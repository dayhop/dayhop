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

  useEffect(() => {
    if (items) return;

    const fetchBestActivities = async () => {
      try {
        const data = await getActivities({
          method: 'offset',
          sort: 'most_reviewed',
          page: 1,
          size: 10,
        });

        setActivities(data.activities);
      } catch {
        setActivities([]);
      }
    };

    fetchBestActivities();
  }, [items]);

  if (!activities.length) return null;

  return <ActivityCardContainer activitiesList={activities} title="🛼 인기 게시물" />;
}
