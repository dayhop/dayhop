'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getActivities } from '@/lib/api/activities';
import type { ActivityItem, ActivityCategory } from '@/types/api';

type ActivityWithCoord = ActivityItem & { lat: number; lng: number };

export function useKakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_JS_API_KEY;

  const [sdkReady, setSdkReady] = useState(false);
  const [loadError, setLoadError] = useState(!kakaoApiKey);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const [activities, setActivities] = useState<ActivityWithCoord[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<ActivityWithCoord[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithCoord | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | '전체'>('전체');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showReSearchBtn, setShowReSearchBtn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(6);
  const lastSearchedCenter = useRef<{ lat: number; lng: number } | null>(null);

  // 로드 타임아웃 감시
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sdkReady) {
        setLoadError(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [sdkReady]);

  // 카카오 지도 SDK 동적 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setSdkReady(true);
      });
      return;
    }

    if (!kakaoApiKey) {
      console.error('[KakaoMap] API Key is missing from environments!');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setSdkReady(true);
        });
      } else {
        setLoadError(true);
      }
    };

    script.onerror = () => {
      setLoadError(true);
    };

    document.head.appendChild(script);
  }, [kakaoApiKey]);

  const geocoderRef = useRef<kakao.maps.services.Geocoder | null>(null);

  // 주소 -> 좌표 지오코딩 헬퍼 함수
  const geocodeAddress = useCallback(
    (address: string): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
          resolve(null);
          return;
        }
        if (!geocoderRef.current) {
          geocoderRef.current = new window.kakao.maps.services.Geocoder();
        }
        geocoderRef.current.addressSearch(address, (result, status) => {
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
    const res = await getActivities({ method: 'offset', size: 100 });
    if (!res.success) {
      setActivities([]);
      return;
    }
    const apiActivities = res.data.activities;

    if (apiActivities && apiActivities.length > 0) {
      const processed = await Promise.all(
        apiActivities.map(async (act) => {
          const coords = await geocodeAddress(act.address);
          if (coords) {
            return { ...act, lat: coords.lat, lng: coords.lng };
          }

          return { ...act, lat: 37.5665, lng: 126.978 };
        })
      );
      setActivities(processed);
    } else {
      setActivities([]);
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

    const defaultLat = 37.5665;
    const defaultLng = 126.978;

    const options = {
      center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
      level: 6,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    setMapInstance(map);
    if (typeof window !== 'undefined') {
      window.kakaoMapInstance = map;
    }

    // 지도 클릭 시 마커 선택 해제
    window.kakao.maps.event.addListener(map, 'click', () => {
      setSelectedActivity(null);
    });

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

    return () => {
      if (typeof window !== 'undefined') {
        window.kakaoMapInstance = undefined;
      }
    };
  }, [sdkReady, mapInstance]);

  // 현재 지도 범위 내(Bounds) 마커들 필터링 계산 함수
  const updateVisibleActivities = useCallback(() => {
    if (!mapInstance || activities.length === 0) return;

    const bounds = mapInstance.getBounds();
    const filtered = activities.filter((act) => {
      if (selectedCategory !== '전체' && act.category !== selectedCategory) {
        return false;
      }
      const position = new window.kakao.maps.LatLng(act.lat, act.lng);
      return bounds.contain(position);
    });

    setVisibleActivities(filtered);

    const currentCenter = mapInstance.getCenter();
    if (lastSearchedCenter.current) {
      const latDiff = Math.abs(currentCenter.getLat() - lastSearchedCenter.current.lat);
      const lngDiff = Math.abs(currentCenter.getLng() - lastSearchedCenter.current.lng);
      if (latDiff > 0.008 || lngDiff > 0.008) {
        setShowReSearchBtn(true);
      } else {
        setShowReSearchBtn(false);
      }
    }
  }, [mapInstance, activities, selectedCategory]);

  // 드래그/줌 종료(idle) 시 화면 내부 체험 갱신 및 상태 리스너 부착
  useEffect(() => {
    if (!mapInstance) return;

    Promise.resolve().then(() => {
      updateVisibleActivities();
    });

    const handleIdle = () => {
      updateVisibleActivities();
      setZoomLevel(mapInstance.getLevel());
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

  // 사용자 위치로 카메라 줌인 이동
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
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
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

  return {
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
  };
}
