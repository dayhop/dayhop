'use client';

import { getActivities } from '@/lib/api/activities';
import { ActivityItem, GetActivitiesParams } from '@/lib/api/activities/type';
import ArrowLeft from '@/assets/icon/arrow-left.svg';
import ArrowRight from '@/assets/icon/arrow-right.svg';

import { useEffect, useState, useRef } from 'react';
import { ActivityCard } from './ActivityCard';

interface ActivityCardProps {
  title: string;
  totalCount: number;
  sort?: 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest';
}

export function ActivityCardContainer({ totalCount, sort, title }: ActivityCardProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getData = async () => {
    const params: GetActivitiesParams = {
      method: 'offset',
      sort: sort,
      size: totalCount,
    };
    const response = await getActivities(params);
    console.log(response.activities);
    setActivities(response.activities);
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
  }, [sort, totalCount]);

  // 이전 페이지로 스크롤
  const handlePrev = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // 스크롤이 맨 앞(0)에 도달했다면 맨 끝으로 이동
      if (scrollLeft <= 0) {
        scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' });
      }
    }
  };

  // 다음 페이지로 스크롤
  const handleNext = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // 스크롤이 맨 끝에 도달했다면 다시 맨 앞(0)으로 이동 (소수점 오차 보정을 위해 Math.ceil 사용)
      if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex max-w-300 flex-col gap-4">
      <div className="flex justify-between">
        <div className="text-lg font-bold md:text-4xl">{title}</div>
        <div className="hidden items-center gap-2 lg:flex">
          <ArrowLeft className="w-11 cursor-pointer" onClick={handlePrev} />
          <ArrowRight className="w-11 cursor-pointer" onClick={handleNext} />
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex scrollbar-none gap-4 overflow-x-auto [-ms-overflow-style:none] lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden"
      >
        {activities.map((activity) => {
          return <ActivityCard key={activity.id} data={activity} />;
        })}
      </div>
    </div>
  );
}
