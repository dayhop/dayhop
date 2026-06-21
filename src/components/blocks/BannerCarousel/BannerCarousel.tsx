'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import CarouselLeft from '@/assets/icon/arrow-left.svg';
import CarouselRight from '@/assets/icon/arrow-right.svg';
import { getActivities } from '@/lib/api/activities';

import type { ActivityItem } from '@/types/api';

interface BannerCarouselProps {
  activities?: ActivityItem[];
}

export const BannerCarousel = ({ activities: initialActivities }: BannerCarouselProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities ?? []);
  const [isLoading, setIsLoading] = useState(!initialActivities);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

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
    if (activities.length <= 1 || isPaused || isAnimating) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setIsTransitionEnabled(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [activities.length, isPaused, isAnimating]);

  if (isLoading) {
    return null;
  }

  if (!activities.length) {
    return (
      <section className="relative mx-auto flex h-[234px] w-full max-w-[1200px] items-center justify-center rounded-3xl bg-gray-50 text-sm text-gray-500 md:h-[290px] xl:h-[390px]">
        등록된 체험이 없습니다.
      </section>
    );
  }

  const displayActivities = activities.length > 1 ? [...activities, activities[0]] : activities;
  const currentActivity = activities[currentIndex % activities.length] || activities[0];

  const handleTransitionEnd = () => {
    setIsAnimating(false);

    if (currentIndex !== activities.length) return;

    setIsTransitionEnabled(false);
    setCurrentIndex(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
    });
  };

  const handlePrev = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (currentIndex === 0) {
      setIsTransitionEnabled(false);
      setCurrentIndex(activities.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
          setCurrentIndex(activities.length - 1);
        });
      });

      return;
    }

    setIsTransitionEnabled(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={resetTouchState}
    >
      <div className="relative xl:hidden">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex gap-4 [--slide-gap:16px] [--slide-width:343px] md:gap-6 md:[--slide-gap:24px] md:[--slide-width:696px] ${
            isTransitionEnabled
              ? 'transition-transform duration-500 ease-in-out'
              : 'transition-none'
          }`}
          style={{
            transform: `translateX(calc(50% - (${currentIndex} * (var(--slide-width) + var(--slide-gap))) - (var(--slide-width) / 2)))`,
          }}
        >
          {displayActivities.map((activity, index) => (
            <Link
              key={`${activity.id}-${index}`}
              href={`/activities/${activity.id}`}
              className="relative h-[234px] w-[343px] shrink-0 overflow-hidden rounded-3xl md:h-[290px] md:w-[696px]"
            >
              <Image
                src={activity.bannerImageUrl}
                alt={activity.title}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 343px, 696px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute top-1/2 left-6 -translate-y-1/2 text-white md:left-10">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                  {activity.category}
                </span>

                <h2 className="mt-4 text-2xl font-bold md:text-3xl">{activity.title}</h2>

                <p className="mt-2 text-sm md:text-base">{activity.address}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative hidden xl:block">
        <Link href={`/activities/${currentActivity.id}`}>
          <div className="relative h-[390px] w-full cursor-pointer overflow-hidden rounded-3xl">
            <Image
              src={currentActivity.bannerImageUrl}
              alt={currentActivity.title}
              fill
              priority
              sizes="1200px"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute top-1/2 left-12 -translate-y-1/2 text-white">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                {currentActivity.category}
              </span>

              <h2 className="mt-4 text-4xl font-bold">{currentActivity.title}</h2>

              <p className="mt-2 text-lg">{currentActivity.address}</p>
            </div>
          </div>
        </Link>
      </div>

      {activities.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="이전 체험"
            className="absolute top-1/2 left-2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center md:left-4 xl:left-0 xl:-translate-x-1/2"
          >
            <CarouselLeft className="h-16 w-16" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="다음 체험"
            className="absolute top-1/2 right-2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center md:right-4 xl:right-0 xl:translate-x-1/2"
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
              onClick={() => {
                if (isAnimating) return;

                setIsAnimating(true);
                setIsTransitionEnabled(true);
                setCurrentIndex(index);
              }}
              aria-label={`${index + 1}번째 배너 보기`}
              className={
                currentIndex % activities.length === index
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
