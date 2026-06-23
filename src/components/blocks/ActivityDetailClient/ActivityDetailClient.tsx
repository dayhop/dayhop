'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { ReservationPaycard } from '@/components/blocks/ReservationPaycard';
import { KebabMenu } from '@/components/blocks/KebabMenu';
import { ActivityDetailMap } from '@/components/blocks/ActivityDetailMap';
import { ActivityReviews } from '@/components/blocks/ActivityReviews';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';

interface GalleryImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  onOpen: (src: string) => void;
}

const GalleryImage = ({ src, alt, sizes, priority, onOpen }: GalleryImageProps) => (
  <Image
    src={src}
    alt={alt}
    fill
    sizes={sizes}
    quality={80}
    priority={priority}
    onClick={() => onOpen(src)}
    className="cursor-zoom-in object-cover transition-transform duration-300 hover:scale-105"
  />
);

interface SubImage {
  id: number;
  imageUrl: string;
}

interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface ActivityData {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  subImages?: SubImage[];
  schedules?: Schedule[];
}

interface ActivityDetailClientProps {
  activity: ActivityData;
}

export const ActivityDetailClient = ({ activity }: ActivityDetailClientProps) => {
  const { user, isLogin } = useAuthStore();
  const isMyActivity = isLogin && user && activity.userId === user.id;

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const subImages = activity.subImages || [];
  const hasSubImages = subImages.length > 0;

  const introText = activity.description ? activity.description.split('\n')[0] : '';

  return (
    <main className="bg-bg min-h-screen pt-10 pb-[100px] lg:pb-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-center gap-10 px-6 lg:flex-row">
        <div className="flex w-full flex-grow flex-col gap-10 lg:max-w-[calc(100%-424px)]">
          <div className="grid h-[350px] grid-cols-1 gap-4 sm:h-[450px] sm:grid-cols-2">
            {/* Main banner image on left */}
            <div
              className={cn(
                'border-border-default relative overflow-hidden rounded-3xl border bg-gray-50 shadow-sm',
                hasSubImages ? 'col-span-1' : 'col-span-2'
              )}
            >
              {activity.bannerImageUrl ? (
                <GalleryImage
                  src={activity.bannerImageUrl}
                  alt={activity.title}
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                  onOpen={setLightboxImage}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  이미지가 없습니다.
                </div>
              )}
            </div>

            {/* Sub-images on right (dynamically split based on count) */}
            {hasSubImages && (
              <div className="col-span-1 h-full">
                {subImages.length === 1 && (
                  <div className="border-border-default relative h-full w-full overflow-hidden rounded-3xl border bg-gray-50 shadow-sm">
                    <GalleryImage
                      src={subImages[0].imageUrl}
                      alt={`${activity.title} sub 0`}
                      sizes="(max-width: 768px) 100vw, 600px"
                      onOpen={setLightboxImage}
                    />
                  </div>
                )}
                {subImages.length === 2 && (
                  <div className="flex h-full flex-col gap-4">
                    {subImages.slice(0, 2).map((sub, index) => (
                      <div
                        key={sub.id || index}
                        className="border-border-default relative w-full flex-1 overflow-hidden rounded-3xl border bg-gray-50 shadow-sm"
                      >
                        <GalleryImage
                          src={sub.imageUrl}
                          alt={`${activity.title} sub ${index}`}
                          sizes="(max-width: 768px) 100vw, 600px"
                          onOpen={setLightboxImage}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {subImages.length === 3 && (
                  <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
                    <div className="border-border-default relative col-span-2 row-span-1 h-full w-full overflow-hidden rounded-3xl border bg-gray-50 shadow-sm">
                      <GalleryImage
                        src={subImages[0].imageUrl}
                        alt={`${activity.title} sub 0`}
                        sizes="(max-width: 768px) 100vw, 600px"
                        onOpen={setLightboxImage}
                      />
                    </div>
                    <div className="border-border-default relative col-span-1 row-span-1 h-full w-full overflow-hidden rounded-3xl border bg-gray-50 shadow-sm">
                      <GalleryImage
                        src={subImages[1].imageUrl}
                        alt={`${activity.title} sub 1`}
                        sizes="(max-width: 768px) 50vw, 300px"
                        onOpen={setLightboxImage}
                      />
                    </div>
                    <div className="border-border-default relative col-span-1 row-span-1 h-full w-full overflow-hidden rounded-3xl border bg-gray-50 shadow-sm">
                      <GalleryImage
                        src={subImages[2].imageUrl}
                        alt={`${activity.title} sub 2`}
                        sizes="(max-width: 768px) 50vw, 300px"
                        onOpen={setLightboxImage}
                      />
                    </div>
                  </div>
                )}
                {subImages.length >= 4 && (
                  <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
                    {subImages.slice(0, 4).map((sub, index) => (
                      <div
                        key={sub.id || index}
                        className="border-border-default relative col-span-1 row-span-1 h-full w-full overflow-hidden rounded-3xl border bg-gray-50 shadow-sm"
                      >
                        <GalleryImage
                          src={sub.imageUrl}
                          alt={`${activity.title} sub ${index}`}
                          sizes="(max-width: 768px) 50vw, 300px"
                          onOpen={setLightboxImage}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 모바일/태블릿 전용 제목 컴포넌트 */}
          <div className="flex flex-col gap-3 px-1 lg:hidden">
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary text-xs font-semibold">{activity.category}</span>
            </div>

            <div className="mt-1 flex items-start justify-between gap-4">
              <h1 className="text-text-primary text-xl leading-tight font-bold md:text-2xl">
                {activity.title}
              </h1>
              {isMyActivity && <KebabMenu activityId={activity.id} />}
            </div>

            <div className="text-text-secondary mt-2 flex items-center gap-1.5 text-sm">
              <svg className="text-yellow h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="text-text-primary font-bold">
                {activity.rating?.toFixed(1) || '0.0'}
              </span>
              <span>({activity.reviewCount || 0})</span>
            </div>

            <div className="text-text-tertiary flex items-center gap-1.5 text-xs">
              <svg
                className="text-text-tertiary h-4 w-4 fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{activity.address}</span>
            </div>

            {introText && (
              <p className="text-text-secondary mt-3 text-sm leading-relaxed font-medium">
                {introText}
              </p>
            )}
          </div>

          <div className="border-border-default border-t pt-10">
            <h2 className="text-text-primary text-xl font-bold">체험 설명</h2>
            <p className="text-text-secondary mt-5 text-sm leading-relaxed font-normal whitespace-pre-wrap md:text-base">
              {activity.description}
            </p>
          </div>

          <div className="border-border-default border-t pt-10">
            <h2 className="text-text-primary text-xl font-bold">오시는 길</h2>
            <p className="text-text-secondary mt-2 mb-5 text-sm font-medium">{activity.address}</p>
            <ActivityDetailMap address={activity.address} />
          </div>

          <ActivityReviews activityId={activity.id} />
        </div>

        <div className="flex w-full shrink-0 flex-col gap-8 lg:w-[384px]">
          {/* 데스크톱 전용 제목 컴포넌트 */}
          <div className="hidden flex-col gap-3 px-1 lg:flex">
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary text-xs font-semibold">{activity.category}</span>
            </div>

            <div className="mt-1 flex items-start justify-between gap-4">
              <h1 className="text-text-primary text-xl leading-tight font-bold md:text-2xl">
                {activity.title}
              </h1>
              {isMyActivity && <KebabMenu activityId={activity.id} />}
            </div>

            <div className="text-text-secondary mt-2 flex items-center gap-1.5 text-sm">
              <svg className="text-yellow h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="text-text-primary font-bold">
                {activity.rating?.toFixed(1) || '0.0'}
              </span>
              <span>({activity.reviewCount || 0})</span>
            </div>

            <div className="text-text-tertiary flex items-center gap-1.5 text-xs">
              <svg
                className="text-text-tertiary h-4 w-4 fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{activity.address}</span>
            </div>

            {introText && (
              <p className="text-text-secondary mt-3 text-sm leading-relaxed font-medium">
                {introText}
              </p>
            )}
          </div>

          {isMyActivity ? (
            <div className="border-border-default shadow-card w-full rounded-3xl border bg-white p-6 text-center lg:max-w-[380px]">
              <p className="text-text-primary text-base font-bold">내가 등록한 체험입니다</p>
              <p className="text-text-tertiary mt-2 text-sm">
                본인이 등록한 체험은 예약할 수 없습니다.
              </p>
            </div>
          ) : (
            <ReservationPaycard
              activityId={activity.id}
              price={activity.price}
              activityTitle={activity.title}
            />
          )}
        </div>
      </div>

      {lightboxImage && (
        <Modal
          onClose={() => setLightboxImage(null)}
          ariaLabel="원본 이미지 보기"
          overlayClassName="bg-black/80 p-4"
          className="!bg-transparent !p-0 !shadow-none"
        >
          <div
            className="relative h-[85vh] w-[90vw] max-w-[1100px]"
            onClick={() => setLightboxImage(null)}
          >
            <Image
              src={lightboxImage}
              alt="원본 이미지"
              fill
              sizes="90vw"
              quality={90}
              className="object-contain"
            />
          </div>
        </Modal>
      )}
    </main>
  );
};
