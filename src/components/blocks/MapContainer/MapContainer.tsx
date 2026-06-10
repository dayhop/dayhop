'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getActivities } from '@/lib/api/activities';
import type { ActivityItem, ActivityCategory } from '@/types/api';

// 카카오 지도 API 객체 타입 정의
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

// 목업 체험 데이터 및 지정 좌표 (Geocoding 캐시/대비용)
const MOCK_ACTIVITIES_WITH_COORDS = [
  {
    id: 1,
    userId: 1,
    title: '나만의 시그니처 향수 만들기 클래스',
    description: '전문 조향사와 함께 세상에 단 하나뿐인 향수를 제작하는 클래스입니다.',
    category: '문화 · 예술' as ActivityCategory,
    price: 45000,
    address: '서울특별시 마포구 서교동 364-2',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewCount: 124,
    createdAt: '2026-06-10T22:00:00.000Z',
    updatedAt: '2026-06-10T22:00:00.000Z',
    lat: 37.5562,
    lng: 126.9227,
  },
  {
    id: 2,
    userId: 1,
    title: '실내 클라이밍 비기너 일일 체험 코스',
    description: '초보자도 안전하고 재미있게 즐길 수 있는 클라이밍 입문 코스입니다.',
    category: '스포츠' as ActivityCategory,
    price: 30000,
    address: '서울특별시 강남구 역삼동 735-3',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewCount: 98,
    createdAt: '2026-06-10T22:00:00.000Z',
    updatedAt: '2026-06-10T22:00:00.000Z',
    lat: 37.4981,
    lng: 127.0276,
  },
  {
    id: 3,
    userId: 1,
    title: '제주 애월 전통 다도 및 화과자 체험클래스',
    description: '아름다운 바다를 바라보며 즐기는 힐링 전통 다도 체험.',
    category: '식음료' as ActivityCategory,
    price: 35000,
    address: '제주특별자치도 제주시 애월읍 애월로 1',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewCount: 62,
    createdAt: '2026-06-10T22:00:00.000Z',
    updatedAt: '2026-06-10T22:00:00.000Z',
    lat: 33.4602,
    lng: 126.319,
  },
  {
    id: 4,
    userId: 1,
    title: '경복궁 한복 대여 및 고궁 스냅 투어',
    description: '아름다운 한복을 입고 전문 작가와 고궁을 거닐며 스냅 사진을 촬영하세요.',
    category: '투어' as ActivityCategory,
    price: 50000,
    address: '서울특별시 종로구 세종로 1-1',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviewCount: 145,
    createdAt: '2026-06-10T22:00:00.000Z',
    updatedAt: '2026-06-10T22:00:00.000Z',
    lat: 37.5759,
    lng: 126.9768,
  },
  {
    id: 5,
    userId: 1,
    title: '원데이 도자기 물레 체험 클래스',
    description: '나만의 그릇과 컵을 물레로 직접 빚어보는 힐링 체험 공방 클래스입니다.',
    category: '문화 · 예술' as ActivityCategory,
    price: 40000,
    address: '서울특별시 마포구 망원동 394-1',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewCount: 43,
    createdAt: '2026-06-10T22:00:00.000Z',
    updatedAt: '2026-06-10T22:00:00.000Z',
    lat: 37.556,
    lng: 126.9015,
  },
  {
    id: 6,
    userId: 1,
    title: '한강 윈드서핑 & SUP 초보 원데이 강습',
    description: '시원한 바람을 맞으며 한강 위를 질주하는 짜릿한 서핑 강습.',
    category: '스포츠' as ActivityCategory,
    price: 60000,
    address: '서울특별시 광진구 자양동 62-1',
    bannerImageUrl:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewCount: 77,
    createdAt: '2026-06-10T22:00:00.000Z',
    updatedAt: '2026-06-10T22:00:00.000Z',
    lat: 37.5325,
    lng: 127.0673,
  },
];

type ActivityWithCoord = ActivityItem & { lat: number; lng: number };

const CATEGORIES: (ActivityCategory | '전체')[] = [
  '전체',
  '문화 · 예술',
  '스포츠',
  '식음료',
  '투어',
  '관광',
  '웰빙',
];

export function MapContainer() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);

  const kakaoApiKey =
    process.env.NEXT_PUBLIC_KAKAO_JS_API_KEY || process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

  // 상태 관리
  const [sdkReady, setSdkReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityWithCoord[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<ActivityWithCoord[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithCoord | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | '전체'>('전체');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [showReSearchBtn, setShowReSearchBtn] = useState(false);
  const lastSearchedCenter = useRef<{ lat: number; lng: number } | null>(null);

  const [loadError, setLoadError] = useState(false);

  // 로드 타임아웃 감시
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sdkReady) {
        setLoadError(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [sdkReady]);

  // 카카오 지도 SDK 동적 로드 및 초기화
  useEffect(() => {
    console.log('[KakaoMap] API Key:', kakaoApiKey);

    // 이미 로드되어 있는 경우
    if (window.kakao && window.kakao.maps) {
      console.log('[KakaoMap] SDK already exists');
      window.kakao.maps.load(() => {
        setSdkReady(true);
      });
      return;
    }

    if (!kakaoApiKey) {
      console.error('[KakaoMap] API Key is missing from environments!');
      return;
    }

    // 스크립트 태그 동적 삽입
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log('[KakaoMap] Script tag onload fired');
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('[KakaoMap] SDK successfully loaded and initialized');
          setSdkReady(true);
        });
      } else {
        console.error(
          '[KakaoMap] Script loaded but window.kakao.maps is undefined. Check key or domain registration.'
        );
        setLoadError(true);
      }
    };

    script.onerror = (e) => {
      console.error('[KakaoMap] Script loading failed', e);
      setLoadError(true);
    };

    document.head.appendChild(script);
  }, [kakaoApiKey]);

  // 주소 -> 좌표 지오코딩 헬퍼 함수
  const geocodeAddress = useCallback(
    (address: string): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
          resolve(null);
          return;
        }
        const geocoder = new window.kakao.maps.services.Geocoder();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK && result[0]) {
            resolve({
              lat: parseFloat(result[0].y),
              lng: parseFloat(result[0].x),
            });
          } else {
            resolve(null);
          }
        });
      });
    },
    []
  );

  // 서버로부터 체험 데이터 가져오기 및 주소 변환
  const fetchActivitiesData = useCallback(async () => {
    try {
      const res = await getActivities({ method: 'offset', size: 100 });
      const apiActivities = res.activities;

      // API 결과가 있으면 각 주소를 지오코딩
      if (apiActivities && apiActivities.length > 0) {
        const processed = await Promise.all(
          apiActivities.map(async (act) => {
            // 목업 데이터와 ID가 겹치고 주소가 동일하다면 성능상 캐시 좌표 사용
            const matchedMock = MOCK_ACTIVITIES_WITH_COORDS.find((m) => m.id === act.id);
            if (matchedMock && matchedMock.address === act.address) {
              return { ...act, lat: matchedMock.lat, lng: matchedMock.lng };
            }

            // 그렇지 않다면 카카오 API 지오코더 구동
            const coords = await geocodeAddress(act.address);
            if (coords) {
              return { ...act, lat: coords.lat, lng: coords.lng };
            }

            // 주소 변환 실패 시 서울 기본 좌표 제공
            return { ...act, lat: 37.5665, lng: 126.978 };
          })
        );
        setActivities(processed);
      } else {
        // 데이터가 없으면 로컬 목업 데이터 사용
        setActivities(MOCK_ACTIVITIES_WITH_COORDS);
      }
    } catch (error) {
      console.warn('API fetch failed, falling back to mock coordinates:', error);
      setActivities(MOCK_ACTIVITIES_WITH_COORDS);
    }
  }, [geocodeAddress]);

  // SDK 로드 완료 후 최초 데이터 로딩
  useEffect(() => {
    if (sdkReady) {
      Promise.resolve().then(() => {
        fetchActivitiesData();
      });
    }
  }, [sdkReady, fetchActivitiesData]);

  // 지도 인스턴스 초기화 및 사용자 위치 탐색
  useEffect(() => {
    if (!sdkReady || !mapRef.current || mapInstance) return;

    // 기본 좌표: 서울특별시청
    const defaultLat = 37.5665;
    const defaultLng = 126.978;

    const options = {
      center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
      level: 6,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    setMapInstance(map);

    // Geolocation을 통한 현위치 이동
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          const newCenter = new window.kakao.maps.LatLng(lat, lng);
          map.setCenter(newCenter);
          lastSearchedCenter.current = { lat, lng };
        },
        () => {
          console.warn('Geolocation failed or permission denied');
          lastSearchedCenter.current = { lat: defaultLat, lng: defaultLng };
        }
      );
    } else {
      lastSearchedCenter.current = { lat: defaultLat, lng: defaultLng };
    }
  }, [sdkReady, mapInstance]);

  // 현재 지도 범위 내(Bounds) 마커들 필터링 계산 함수
  const updateVisibleActivities = useCallback(() => {
    if (!mapInstance || activities.length === 0) return;

    const bounds = mapInstance.getBounds();
    const filtered = activities.filter((act) => {
      // 1. 카테고리 필터링
      if (selectedCategory !== '전체' && act.category !== selectedCategory) {
        return false;
      }
      // 2. 지도 범위 내 필터링
      const position = new window.kakao.maps.LatLng(act.lat, act.lng);
      return bounds.contain(position);
    });

    setVisibleActivities(filtered);

    // 사용자가 지도 중심을 크게 이동했는지 체크하여 재검색 버튼 표시
    const currentCenter = mapInstance.getCenter();
    if (lastSearchedCenter.current) {
      const latDiff = Math.abs(currentCenter.getLat() - lastSearchedCenter.current.lat);
      const lngDiff = Math.abs(currentCenter.getLng() - lastSearchedCenter.current.lng);
      // 약 1km 이상 벌어지면 노출 (좌표값 기준 대략 0.008 오차)
      if (latDiff > 0.008 || lngDiff > 0.008) {
        setShowReSearchBtn(true);
      } else {
        setShowReSearchBtn(false);
      }
    }
  }, [mapInstance, activities, selectedCategory]);

  // 드래그 종료(idle) 시 화면 내부 체험 갱신 및 상태 리스너 부착
  useEffect(() => {
    if (!mapInstance) return;

    // 최초 갱신
    Promise.resolve().then(() => {
      updateVisibleActivities();
    });

    const handleIdle = () => {
      updateVisibleActivities();
    };

    window.kakao.maps.event.addListener(mapInstance, 'idle', handleIdle);

    return () => {
      if (window.kakao && window.kakao.maps && mapInstance) {
        window.kakao.maps.event.removeListener(mapInstance, 'idle', handleIdle);
      }
    };
  }, [mapInstance, updateVisibleActivities]);

  // 카테고리 변경 시 재필터링
  useEffect(() => {
    Promise.resolve().then(() => {
      updateVisibleActivities();
    });
  }, [selectedCategory, updateVisibleActivities]);

  // 마커 표시 및 갱신 제어
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapInstance) return;

    // 기존 마커 전체 삭제
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 현재 조건에 부합하는 체험들만 마커 표시
    activities.forEach((act) => {
      // 카테고리 매칭 필터링
      if (selectedCategory !== '전체' && act.category !== selectedCategory) {
        return;
      }

      const isSelected = selectedActivity?.id === act.id;
      const markerPosition = new window.kakao.maps.LatLng(act.lat, act.lng);

      // 선택 상태에 따른 색상 분기 (간단히 카카오 핀 리소스 활용 또는 커스텀 이미지)
      // 활성화된 마커는 더 크고 눈에 띄게 제작
      const imageSrc = isSelected
        ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png' // 활성 마커
        : 'https://t1.daumcdn.net/mapjsapi/images/2x/marker.png'; // 기본 마커

      const imageSize = isSelected
        ? new window.kakao.maps.Size(28, 42)
        : new window.kakao.maps.Size(24, 35);

      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
        title: act.title,
      });

      marker.setMap(mapInstance);

      // 마커 클릭 시 정보 카드 팝업 표시 및 해당 마커 중심 이동
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedActivity(act);
        mapInstance.panTo(markerPosition);
      });

      markersRef.current.push(marker);
    });
  }, [mapInstance, activities, selectedCategory, selectedActivity]);

  // 사용자 위치 마커 표시
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapInstance || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    const position = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);

    // 파란색 원형 내 위치 마커 생성 (Tailwind 기반 Custom Overlay 혹은 이미지 대체)
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png';
    const imageSize = new window.kakao.maps.Size(20, 20);
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    const userMarker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
      title: '내 위치',
    });

    userMarker.setMap(mapInstance);
    userMarkerRef.current = userMarker;
  }, [mapInstance, userLocation]);

  // 현재 사용자 내 위치로 카메라 줌인 이동
  const handleMoveToMyLocation = () => {
    if (navigator.geolocation && mapInstance) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          const newCenter = new window.kakao.maps.LatLng(lat, lng);
          mapInstance.panTo(newCenter);
          lastSearchedCenter.current = { lat, lng };
          setShowReSearchBtn(false);
        },
        () => {
          alert('위치 권한이 거부되었거나 위치 정보를 가져올 수 없습니다.');
        }
      );
    }
  };

  // 이 위치에서 재검색 액션
  const handleReSearch = () => {
    if (!mapInstance) return;
    const center = mapInstance.getCenter();
    const lat = center.getLat();
    const lng = center.getLng();
    lastSearchedCenter.current = { lat, lng };
    setShowReSearchBtn(false);
    updateVisibleActivities();
  };

  return (
    <div className="relative mx-auto flex h-screen max-w-[720px] flex-col overflow-hidden bg-white shadow-xl">
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
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 active:bg-gray-100"
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
          <div className="flex h-[52px] scrollbar-none items-center gap-2 overflow-x-auto bg-white px-4 py-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3. Map Viewport & Overlays */}
          <div className="relative w-full flex-1">
            {/* Map Container Element */}
            <div ref={mapRef} className="h-full w-full" />

            {/* 3-A. 이 위치에서 검색 플로팅 버튼 */}
            {showReSearchBtn && (
              <button
                type="button"
                onClick={handleReSearch}
                className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-md transition-all hover:bg-gray-50"
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
              className="absolute right-6 bottom-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-lg transition-all hover:bg-gray-50 active:bg-gray-100"
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

            {/* 3-C. 하단 Bottom Sheet 정보 카드 (마커 선택 시 부드럽게 노출) */}
            {selectedActivity && (
              <div className="animate-fade-in absolute right-6 bottom-6 left-6 z-10">
                <div className="relative flex w-full gap-4 rounded-2xl border border-gray-100/50 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
                  {/* 닫기 버튼 */}
                  <button
                    type="button"
                    onClick={() => setSelectedActivity(null)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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

                  {/* 썸네일 */}
                  <div
                    className="relative aspect-square w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-100"
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
                  <div className="flex flex-col justify-between py-0.5 pr-4">
                    <div
                      onClick={() => router.push(`/activity/${selectedActivity.id}`)}
                      className="cursor-pointer"
                    >
                      <span className="text-primary bg-primary-100 rounded-md px-2 py-0.5 text-[10px] font-bold">
                        {selectedActivity.category}
                      </span>
                      <h4 className="hover:text-primary mt-1.5 line-clamp-1 text-sm font-bold text-gray-900 transition-colors">
                        {selectedActivity.title}
                      </h4>
                      <p className="mt-1 line-clamp-1 text-[11px] text-gray-500">
                        {selectedActivity.address}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-6">
                      {/* 평점 */}
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-3.5 w-3.5 fill-current text-yellow-500"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-gray-800">
                          {selectedActivity.rating}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ({selectedActivity.reviewCount})
                        </span>
                      </div>

                      {/* 가격 */}
                      <span className="text-sm font-extrabold text-gray-900">
                        ₩{selectedActivity.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
