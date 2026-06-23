'use client';

import { ActivityItem } from '@/lib/api/activities/type';
import ArrowLeft from '@/assets/icon/arrow-left.svg';
import ArrowRight from '@/assets/icon/arrow-right.svg';

import { useEffect, useRef } from 'react';
import { MainActivityCard } from './MainActivityCard';
import Link from 'next/link';

interface MainActivityCardContainerProps {
  activitiesList: ActivityItem[];
  title: string;
  showMore?: boolean;
}

export function MainActivityCardContainer({
  activitiesList,
  title,
  showMore,
}: MainActivityCardContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: 'auto' });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

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
      <div className="flex items-center justify-between">
        <div className="pl-5 text-lg font-bold md:pl-7.5 md:text-3xl xl:px-3">{title}</div>
        {showMore ? (
          <Link
            href={'/activities'}
            className="flex h-10 items-center text-sm text-gray-500 lg:pr-5"
          >
            전체보기
          </Link>
        ) : (
          <div className="hidden items-center gap-2 lg:flex">
            <ArrowLeft className="h-10 w-10 cursor-pointer" onClick={handlePrev} />
            <ArrowRight className="h-10 w-10 cursor-pointer" onClick={handleNext} />
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        className="flex scrollbar-none gap-4 overflow-x-auto px-5 py-3 [-ms-overflow-style:none] md:px-7.5 lg:overflow-x-hidden xl:px-3 [&::-webkit-scrollbar]:hidden"
      >
        {activitiesList.map((activity) => {
          return <MainActivityCard key={activity.id} data={activity} />;
        })}
      </div>
    </div>
  );
}
