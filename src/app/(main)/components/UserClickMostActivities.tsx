'use client';

import { ActivityCardContainer } from '@/components/blocks/Main/ActivityCardContainer';
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
      const results = await Promise.allSettled(
        userfitList.map((activityId) => getActivity(Number(activityId)))
      );

      const data = results
        .filter((r): r is PromiseFulfilledResult<ActivityResponse> => r.status === 'fulfilled')
        .map((r) => r.value);

      setActivitiesList(data);
    };

    const getNickname = async () => {
      try {
        const user = await getMyUser();
        setNickname(user.nickname);
      } catch {}
    };

    fetchActivities();
    getNickname();
  }, []);

  if (activitiesList.length === 0) return null;

  const name = nickname || '회원';

  return (
    <div>
      <ActivityCardContainer title={`${name}님이 자주 찾는 체험`} activitiesList={activitiesList} />
    </div>
  );
}
