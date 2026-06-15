'use client';

import { ActivityCardContainer } from '@/components/blocks/Main/ActivityCardContainer';
import { getActivity } from '@/lib/api/activities';
import { getMyUser } from '@/lib/api/users';
import { ActivityItem } from '@/types/api';
import { useEffect, useState } from 'react';

export function UserFitActivities() {
  const [activitiesList, setActivitiesList] = useState<ActivityItem[]>([]);
  const [nickname, setNickname] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchActivities = async () => {
      const userClickActicities = localStorage.getItem('useActivity');
      if (!userClickActicities) return;
      const list = JSON.parse(userClickActicities).clicks;
      const userfitList = Object.entries(list)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([id]) => id);
      const data = await Promise.all(
        userfitList.map((activityId) => getActivity(Number(activityId)))
      );
      setActivitiesList(data);
    };

    const getNickname = async () => {
      const user = await getMyUser();
      setNickname(user.nickname);
    };

    fetchActivities();
    getNickname();
  }, []);

  return (
    <div>
      <ActivityCardContainer title={`${nickname}님에게 딱 맞는!`} activitiesList={activitiesList} />
    </div>
  );
}
