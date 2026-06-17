'use client';

import { ActivityCardContainer } from '@/components/blocks/Main/ActivityCardContainer';
import { getActivities } from '@/lib/api/activities';
import { ActivityItem, GetActivitiesParams } from '@/lib/api/activities/type';
import { useEffect, useState } from 'react';
import { UserClickMostActivities } from './components/UserClickMostActivities';
import { Userfit } from './components/Userfit';

export default function HomeActivitySection() {
  const [data, setData] = useState<ActivityItem[]>([]);

  const getData = async () => {
    const params: GetActivitiesParams = {
      method: 'offset',
      sort: 'latest',
      size: 10,
    };
    const response = await getActivities(params);
    setData(response.activities);
    return response.activities;
  };
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await getData();
      } catch (error) {
        throw new Error('활동 데이터를 가져오는데 실패했습니다.', { cause: error });
      }
    };

    fetchActivities();
  }, []);

  return (
    <section className="w-full py-10">
      <ActivityCardContainer title="🔥 이번 주 인기 액티비티" activitiesList={data} />
      <UserClickMostActivities />
      <Userfit />
    </section>
  );
}
