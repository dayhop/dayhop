'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const isDraggingRef = useRef(false);

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
      <section className="relative mx-auto w-full max-w-[1200px] overflow-hidden xl:overflow-visible">
        <div className="h-[210px] w-full animate-pulse rounded-3xl bg-gray-200 md:h-[260px] xl:h-[340px]" />
      </section>
    );
  }

  if (!activities.length) {
    return (
      <section className="relative mx-auto flex h-[210px] w-full max-w-[1200px] items-center justify-center rounded-3xl bg-gray-50 text-sm text-gray-500 md:h-[260px] xl:h-[340px]">
        등록된 체험이 없습니다.
      </section>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activities.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === activities.length - 1 ? 0 : prev + 1));
  };

  const handleStart = (clientX: number, clientY: number, preventDefault?: () => void) => {
    if (preventDefault) preventDefault();
    setIsPaused(true);
    setStartX(clientX);
    setStartY(clientY);
    isDraggingRef.current = false;
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (startX === null || startY === null) return;
    const diffX = Math.abs(startX - clientX);
    const diffY = Math.abs(startY - clientY);
    if (diffX > 10 || diffY > 10) {
      isDraggingRef.current = true;
    }
  };

  const handleEnd = (clientX: number, clientY: number) => {
    setIsPaused(false);
    if (startX === null || startY === null) return;
    const diffX = startX - clientX;
    const diffY = startY - clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setStartX(null);
    setStartY(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (startX !== null) {
          setStartX(null);
          setStartY(null);
          setIsPaused(false);
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 50);
        }
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY, () => e.preventDefault())}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={(e) => handleEnd(e.clientX, e.clientY)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={(e) => {
        const touch = e.changedTouches[0];
        handleEnd(touch.clientX, touch.clientY);
      }}
      className="relative mx-auto w-full max-w-[1200px] overflow-hidden select-none xl:overflow-visible"
    >
      {/* Mobile & Tablet View */}
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
              onClick={(e) => {
                if (isDraggingRef.current) {
                  e.preventDefault();
                }
              }}
              onDragStart={(e) => e.preventDefault()}
              className="relative h-[210px] w-[320px] shrink-0 overflow-hidden rounded-3xl md:h-[260px] md:w-[640px]"
            >
              <Image
                src={activity.bannerImageUrl}
                alt={activity.title}
                fill
                sizes="(min-width: 768px) 640px, 320px"
                quality={80}
                priority={index === 0}
                className="pointer-events-none object-cover select-none"
                draggable={false}
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

      {/* Desktop View */}
      <div className="relative hidden w-full overflow-hidden rounded-3xl xl:block">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {activities.map((activity, index) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              onClick={(e) => {
                if (isDraggingRef.current) {
                  e.preventDefault();
                }
              }}
              onDragStart={(e) => e.preventDefault()}
              className="relative block h-[340px] w-full shrink-0 cursor-pointer"
            >
              <Image
                src={activity.bannerImageUrl}
                alt={activity.title}
                fill
                sizes="1200px"
                quality={80}
                priority={index === 0}
                className="pointer-events-none object-cover select-none"
                draggable={false}
              />

              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black">
                  {activity.category}
                </span>

                <h2 className="mt-3 text-3xl font-bold">{activity.title}</h2>

                <p className="mt-2 text-base">{activity.address}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {activities.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {activities.map((activity, index) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 배너 보기`}
              className={`cursor-pointer rounded-full transition-all duration-300 ${
                currentIndex === index ? 'h-2 w-5 bg-white' : 'h-2 w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
