'use client';

import { ActivityItem } from '@/lib/api/activities/type';
import ArrowLeft from '@/assets/icon/arrow-left.svg';
import ArrowRight from '@/assets/icon/arrow-right.svg';

import { useRef } from 'react';
import { ActivityCard } from './ActivityCard';

interface ActivityCardProps {
  activitiesList: ActivityItem[];
  title: string;
}

export function ActivityCardContainer({ activitiesList, title }: ActivityCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (scrollLeft <= 0) {
        scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' });
      }
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
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
        {activitiesList.map((activity) => {
          return <ActivityCard key={activity.id} data={activity} />;
        })}
      </div>
    </div>
  );
}
