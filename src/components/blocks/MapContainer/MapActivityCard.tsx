'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ActivityItem } from '@/types/api';

import { StarRating } from '@/components/ui/StarRating';

type ActivityWithCoord = ActivityItem & { lat: number; lng: number };

interface MapActivityCardProps {
  selectedActivity: ActivityWithCoord;
  activities: ActivityWithCoord[];
  mapInstance: kakao.maps.Map | null;
  onSelectActivity: (activity: ActivityWithCoord | null) => void;
}

export function MapActivityCard({
  selectedActivity,
  activities,
  mapInstance,
  onSelectActivity,
}: MapActivityCardProps) {
  const router = useRouter();

  // 동일한 좌표(주소지)를 가진 체험들을 그룹화
  const selectedGroup = useMemo(() => {
    return activities.filter(
      (act) => act.lat === selectedActivity.lat && act.lng === selectedActivity.lng
    );
  }, [activities, selectedActivity.lat, selectedActivity.lng]);

  const currentIndex = useMemo(() => {
    return selectedGroup.findIndex((act) => act.id === selectedActivity.id);
  }, [selectedGroup, selectedActivity.id]);

  const hasMultiple = selectedGroup.length > 1;

  const handlePrev = () => {
    if (!mapInstance) return;
    const prevIndex = (currentIndex - 1 + selectedGroup.length) % selectedGroup.length;
    const nextAct = selectedGroup[prevIndex];
    onSelectActivity(nextAct);

    // 지도의 중심을 해당 위치로 이동
    const targetPos = new window.kakao.maps.LatLng(nextAct.lat, nextAct.lng);
    mapInstance.panTo(targetPos);
  };

  const handleNext = () => {
    if (!mapInstance) return;
    const nextIndex = (currentIndex + 1) % selectedGroup.length;
    const nextAct = selectedGroup[nextIndex];
    onSelectActivity(nextAct);

    // 지도의 중심을 해당 위치로 이동
    const targetPos = new window.kakao.maps.LatLng(nextAct.lat, nextAct.lng);
    mapInstance.panTo(targetPos);
  };

  return (
    <div className="animate-fade-in absolute bottom-6 left-1/2 z-10 flex w-full max-w-[470px] -translate-x-1/2 flex-col items-center gap-3 px-4 md:max-w-[560px] md:px-0">
      <div className="relative flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-100/50 bg-white/95 p-5 shadow-2xl backdrop-blur-md md:p-6">
        {/* 전체 닫기 버튼 */}
        <button
          type="button"
          onClick={() => onSelectActivity(null)}
          className="absolute top-2.5 right-2.5 z-20 flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          aria-label="정보창 닫기"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 캐러셀 좌측 이동 버튼 */}
        {hasMultiple && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 active:bg-gray-100"
            aria-label="이전 상품"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 카드 본체 */}
        <div className="flex min-w-0 flex-1 items-center gap-5 md:gap-6">
          {/* 썸네일 */}
          <div
            className="relative aspect-square w-32 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:w-36"
            onClick={() => router.push(`/activity/${selectedActivity.id}`)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedActivity.bannerImageUrl}
              alt={selectedActivity.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* 정보 */}
          <div className="flex h-full min-w-0 flex-1 flex-col justify-between py-0.5 pr-2">
            <div
              onClick={() => router.push(`/activity/${selectedActivity.id}`)}
              className="cursor-pointer"
            >
              <span className="text-primary bg-primary-100 rounded-md px-2 py-0.5 text-xs font-bold">
                {selectedActivity.category}
              </span>
              <h4 className="hover:text-primary mt-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors md:text-lg">
                {selectedActivity.title}
              </h4>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500 md:text-sm">
                {selectedActivity.address}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              {/* 평점 */}
              <StarRating
                rating={selectedActivity.rating}
                mode="display"
                className="shrink-0 origin-left scale-105 md:scale-110"
              />

              {/* 가격 */}
              <span className="truncate text-right text-base font-black text-gray-900 md:text-lg">
                ₩{selectedActivity.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 캐러셀 우측 이동 버튼 */}
        {hasMultiple && (
          <button
            type="button"
            onClick={handleNext}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 active:bg-gray-100"
            aria-label="다음 상품"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* 카드 하단에 페이지네이션 페이지 수 표시 */}
      {hasMultiple && (
        <div className="rounded-full bg-black/65 px-3.5 py-1.5 text-xs font-bold tracking-wider text-white shadow-md backdrop-blur-sm">
          {currentIndex + 1} / {selectedGroup.length}
        </div>
      )}
    </div>
  );
}
