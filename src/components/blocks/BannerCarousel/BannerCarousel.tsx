'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import CarouselLeft from '@/assets/icon/arrow-left.svg';
import CarouselRight from '@/assets/icon/arrow-right.svg';
import { getActivities } from '@/lib/api/activities';

import type { ActivityItem } from '@/lib/api/activities/type';

interface BannerCarouselProps {
  activities?: ActivityItem[];
}

export const BannerCarousel = ({ activities: initialActivities }: BannerCarouselProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities ?? []);
  const [isLoading, setIsLoading] = useState(!initialActivities);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (initialActivities) return;

    const fetchBannerActivities = async () => {
      try {
        const res = await getActivities({
          method: 'offset',
          sort: 'latest',
          page: 1,
          size: 4,
        });

        setActivities(res.success ? res.data.activities : []);
      } catch {
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerActivities();
  }, [initialActivities]);

  useEffect(() => {
    if (activities.length <= 1 || isPaused || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === activities.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [activities.length, isPaused, isHovered]);

  if (isLoading) return null;

  if (!activities.length) {
    return (
      <section className="relative mx-auto flex h-[234px] w-full max-w-[1200px] items-center justify-center rounded-3xl bg-gray-50 text-sm text-gray-500 md:h-[290px] xl:h-[390px]">
        등록된 체험이 없습니다.
      </section>
    );
  }

  const currentActivity = activities[currentIndex] || activities[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activities.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === activities.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsPaused(true);
  };

  const resetTouchState = () => {
    setTouchStartX(null);
    setTouchStartY(null);
    setIsPaused(false);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartX === null || touchStartY === null) {
      resetTouchState();
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    resetTouchState();
  };

  return (
    <section
      className="relative mx-auto w-full max-w-[1200px] overflow-hidden xl:overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={resetTouchState}
    >
      <Link href={`/activities/${currentActivity.id}`}>
        <div className="relative h-[234px] w-full cursor-pointer overflow-hidden rounded-3xl md:h-[290px] xl:h-[390px]">
          <Image
            src={currentActivity.bannerImageUrl}
            alt={currentActivity.title}
            fill
            priority
            sizes="(min-width: 1280px) 1200px, (min-width: 768px) 696px, 343px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white md:left-14 xl:left-12">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
              {currentActivity.category}
            </span>

            <h2 className="mt-4 text-2xl font-bold md:text-3xl xl:text-4xl">
              {currentActivity.title}
            </h2>

            <p className="mt-2 text-sm md:text-base xl:text-lg">{currentActivity.address}</p>
          </div>
        </div>
      </Link>

      {activities.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="이전 체험"
            className="absolute top-1/2 left-0 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <CarouselLeft className="h-16 w-16" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="다음 체험"
            className="absolute top-1/2 right-0 z-10 flex h-16 w-16 translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <CarouselRight className="h-16 w-16" />
          </button>
        </>
      )}

      {activities.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {activities.map((activity, index) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 배너 보기`}
              className={
                currentIndex === index
                  ? 'h-2 w-6 rounded-full bg-white'
                  : 'h-2 w-2 rounded-full bg-white/50'
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};
