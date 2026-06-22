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

  if (isLoading) {
    return (
      <section className="relative mx-auto w-full max-w-[1120px] overflow-hidden xl:overflow-visible">
        <div className="h-[210px] w-full animate-pulse rounded-3xl bg-gray-200 md:h-[260px] xl:h-[340px]" />
      </section>
    );
  }

  if (!activities.length) {
    return (
      <section className="relative mx-auto flex h-[210px] w-full max-w-[1120px] items-center justify-center rounded-3xl bg-gray-50 text-sm text-gray-500 md:h-[260px] xl:h-[340px]">
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

  return (
    <section className="relative mx-auto w-full max-w-[1120px] overflow-hidden xl:overflow-visible">
      <div className="relative xl:hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out [--slide-gap:16px] [--slide-width:320px] md:gap-6 md:[--slide-gap:24px] md:[--slide-width:640px]"
          style={{
            transform: `translateX(calc(50% - (${currentIndex} * (var(--slide-width) + var(--slide-gap))) - (var(--slide-width) / 2)))`,
          }}
        >
          {activities.map((activity, index) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              className="relative h-[210px] w-[320px] shrink-0 overflow-hidden rounded-3xl md:h-[260px] md:w-[640px]"
            >
              <Image
                src={activity.bannerImageUrl}
                alt={activity.title}
                fill
                sizes="(min-width: 768px) 640px, 320px"
                quality={80}
                priority={index === 0}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute top-1/2 left-5 -translate-y-1/2 text-white md:left-8">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black">
                  {activity.category}
                </span>

                <h2 className="mt-3 text-xl font-bold md:text-2xl">{activity.title}</h2>

                <p className="mt-2 text-xs md:text-sm">{activity.address}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative hidden xl:block">
        <Link href={`/activities/${currentActivity.id}`}>
          <div className="relative h-[340px] w-full cursor-pointer overflow-hidden rounded-3xl">
            <Image
              src={currentActivity.bannerImageUrl}
              alt={currentActivity.title}
              fill
              sizes="1120px"
              quality={80}
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white">
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black">
                {currentActivity.category}
              </span>

              <h2 className="mt-3 text-3xl font-bold">{currentActivity.title}</h2>

              <p className="mt-2 text-base">{currentActivity.address}</p>
            </div>
          </div>
        </Link>

        {activities.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="이전 체험"
              className="absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <CarouselLeft className="h-10 w-10" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="다음 체험"
              className="absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2"
            >
              <CarouselRight className="h-10 w-10" />
            </button>
          </>
        )}
      </div>

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
                  ? 'h-2 w-5 rounded-full bg-white'
                  : 'h-2 w-2 rounded-full bg-white/50'
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};
