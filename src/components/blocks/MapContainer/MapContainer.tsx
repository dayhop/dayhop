'use client';

import { useRouter } from 'next/navigation';
import { useKakaoMap } from './useKakaoMap';
import { useMapMarkers } from './useMapMarkers';
import { MapCategoryPills } from './MapCategoryPills';
import { MapActivityCard } from './MapActivityCard';

export function MapContainer() {
  const router = useRouter();

  // 모든 카카오 지도 상태 및 조작 핸들러 호출
  const {
    mapRef,
    sdkReady,
    loadError,
    mapInstance,
    activities,
    visibleActivities,
    selectedActivity,
    setSelectedActivity,
    selectedCategory,
    setSelectedCategory,
    userLocation,
    showReSearchBtn,
    zoomLevel,
    handleMoveToMyLocation,
    handleReSearch,
  } = useKakaoMap();

  // 지도 마커 관리 훅 호출
  useMapMarkers({
    mapInstance,
    activities,
    selectedCategory,
    selectedActivity,
    onSelectActivity: setSelectedActivity,
    isClustered: zoomLevel > 5,
    userLocation,
  });

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white">
      {!sdkReady ? (
        <div className="bg-gray-25 flex h-full w-full flex-col items-center justify-center px-6 text-center">
          {loadError ? (
            <div className="flex flex-col items-center gap-4">
              <svg
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-base font-bold text-gray-900">지도 로드 실패</h3>
              <p className="max-w-xs text-xs leading-relaxed text-gray-500">
                카카오 지도 SDK를 불러올 수 없습니다.
                <br />
                환경변수(.env.local)의 키가 올바른지, Kakao Developers 플랫폼 설정에 현재
                도메인(localhost:3000)이 등록되어 있는지 확인해 주세요.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary-dark mt-2 cursor-pointer rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-gray-200"></div>
              <span className="text-sm font-semibold text-gray-500">
                지도를 불러오는 중입니다...
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 1. Header Bar */}
          <header className="flex h-[56px] items-center border-b border-gray-100 bg-white px-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-50 active:bg-gray-100"
              aria-label="홈으로 돌아가기"
            >
              <svg
                className="h-6 w-6 text-gray-950"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="ml-2 text-lg font-bold text-gray-900">내 주변 체험</h1>
          </header>

          {/* 2. Category Scroll Pills */}
          <MapCategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* 3. Map Viewport & Overlays */}
          <div className="relative w-full flex-1">
            {/* Map Container Element */}
            <div ref={mapRef} className="h-full w-full" />

            {/* 3-A. 이 위치에서 검색 플로팅 버튼 */}
            {showReSearchBtn && (
              <button
                type="button"
                onClick={handleReSearch}
                className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-md transition-all hover:bg-gray-50"
              >
                <svg
                  className="text-primary h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6.578M3 9h8.7M3 9V3"
                  />
                </svg>
                이 위치에서 검색
              </button>
            )}

            {/* 3-B. 현재 내 위치 버튼 */}
            <button
              type="button"
              onClick={handleMoveToMyLocation}
              className="absolute right-6 bottom-6 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-lg transition-all hover:bg-gray-50 active:bg-gray-100"
              aria-label="현재 위치로 지도 이동"
            >
              <svg
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
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
            </button>

            {/* 3-C. 하단 Bottom Sheet 정보 카드 */}
            {selectedActivity && (
              <MapActivityCard
                selectedActivity={selectedActivity}
                activities={activities}
                mapInstance={mapInstance}
                onSelectActivity={setSelectedActivity}
              />
            )}
          </div>

          {/* 4. 내 지도 범위 내 목록 개수 간이 표시바 */}
          <div className="z-10 flex items-center justify-between border-t border-gray-100 bg-white px-5 py-3 shadow-md">
            <span className="text-xs font-medium text-gray-500">
              현재 지도 범위 내에{' '}
              <strong className="font-bold text-gray-900">{visibleActivities.length}개</strong>의
              체험이 있습니다.
            </span>
            {visibleActivities.length > 0 && (
              <span className="text-primary text-[11px] font-semibold">
                마커를 터치하여 정보를 확인하세요
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
