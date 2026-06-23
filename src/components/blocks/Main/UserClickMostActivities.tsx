'use client';

import { MainActivityCardContainer } from '@/components/blocks/Main/MainActivityCardContainer';
import { getActivity } from '@/lib/api/activities';
import { ActivityResponse } from '@/lib/api/activities/type';
import { getMyUser } from '@/lib/api/users';
import { ActivityItem } from '@/types/api';
import { useEffect, useState } from 'react';

export function UserClickMostActivities() {
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
      const results = await Promise.all(
        userfitList.map((activityId) => getActivity(Number(activityId)))
      );

      const data = results
        .filter((r): r is { success: true; data: ActivityResponse } => r.success)
        .map((r) => r.data);

      setActivitiesList(data);
    };

    const getNickname = async () => {
      const res = await getMyUser();
      if (res.success) setNickname(res.data.nickname);
    };

    fetchActivities();
    getNickname();
  }, []);

  if (activitiesList.length === 0) return null;

  const name = nickname || '회원';

  return (
    <div>
      <MainActivityCardContainer
        title={`${name}님이 자주 찾는 체험`}
        activitiesList={activitiesList}
      />
    </div>
  );
}
