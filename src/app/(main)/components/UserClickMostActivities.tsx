'use client';

import { ActivityCardContainer } from '@/components/blocks/Main/ActivityCardContainer';
import { getActivity } from '@/lib/api/activities';
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
      console.log(userClickActicities);
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
    try {
      getNickname();
    } catch {}
  }, []);

  const name = nickname || '회원';

  return (
    <div>
      <ActivityCardContainer title={`${name}님이 자주 찾는 체험`} activitiesList={activitiesList} />
    </div>
  );
}
