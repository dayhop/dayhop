'use client';

import { useEffect, useRef } from 'react';
import type { ActivityItem, ActivityCategory } from '@/types/api';

type ActivityWithCoord = ActivityItem & { lat: number; lng: number };

interface UseMapMarkersParams {
  mapInstance: kakao.maps.Map | null;
  activities: ActivityWithCoord[];
  selectedCategory: ActivityCategory | '전체';
  selectedActivity: ActivityWithCoord | null;
  onSelectActivity: (activity: ActivityWithCoord | null) => void;
  zoomLevel: number;
  userLocation: { lat: number; lng: number } | null;
}

export function useMapMarkers({
  mapInstance,
  activities,
  selectedCategory,
  selectedActivity,
  onSelectActivity,
  zoomLevel,
  userLocation,
}: UseMapMarkersParams) {
  const markersRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const userMarkerRef = useRef<kakao.maps.Marker | null>(null);

  // 1. 체험 마커 표시 및 갱신 제어
  useEffect(() => {
    if (!mapInstance) return;

    // 기존 마커/오버레이 전체 삭제
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 현재 선택 카테고리에 부합하는 체험들만 필터링
    const filteredActivities = activities.filter((act) => {
      if (selectedCategory !== '전체' && act.category !== selectedCategory) {
        return false;
      }
      return true;
    });

    // 좌표별 그룹화 (임시로 동일 주소지에 있는 상품들을 파악하기 위함)
    const coordGroups: { [key: string]: ActivityWithCoord[] } = {};
    filteredActivities.forEach((act) => {
      const key = `${act.lat.toFixed(5)},${act.lng.toFixed(5)}`;
      if (!coordGroups[key]) {
        coordGroups[key] = [];
      }
      coordGroups[key].push(act);
    });

    // 각 그룹에 대해 커스텀 오버레이 생성
    const groups: {
      [key: string]: {
        activities: ActivityWithCoord[];
        position: kakao.maps.LatLng;
        originalPosition: kakao.maps.LatLng;
      };
    } = {};

    if (zoomLevel <= 5) {
      // 줌 레벨이 5 이하로 충분히 가까워지면 그룹화하지 않고, 동일 좌표의 경우 둥글게 퍼지도록 오프셋 적용
      Object.keys(coordGroups).forEach((coordKey) => {
        const list = coordGroups[coordKey];
        const total = list.length;
        list.forEach((act, idx) => {
          let position = new window.kakao.maps.LatLng(act.lat, act.lng);
          if (total > 1) {
            // 동일 좌표가 여러 개인 경우 각도에 따라 오프셋 적용 (약 20m 반경)
            const angle = (idx * 2 * Math.PI) / total;
            const radius = 0.00018;
            const offsetLat = Math.sin(angle) * radius;
            const offsetLng = Math.cos(angle) * radius;
            position = new window.kakao.maps.LatLng(act.lat + offsetLat, act.lng + offsetLng);
          }
          const key = `single-${act.id}`;
          groups[key] = {
            activities: [act],
            position: position,
            originalPosition: new window.kakao.maps.LatLng(act.lat, act.lng),
          };
        });
      });
    } else {
      // 줌 레벨이 6 이상이면 동일 좌표별로 뭉뚱그려 그룹핑
      Object.keys(coordGroups).forEach((coordKey) => {
        const list = coordGroups[coordKey];
        const firstAct = list[0];
        const position = new window.kakao.maps.LatLng(firstAct.lat, firstAct.lng);
        groups[coordKey] = {
          activities: list,
          position: position,
          originalPosition: position,
        };
      });
    }

    Object.keys(groups).forEach((key) => {
      const group = groups[key];
      const firstAct = group.activities[0];
      const position = group.position;
      const originalPosition = group.originalPosition;

      // 현재 선택된 상품이 이 그룹에 속해있는지 확인
      const isSelected = selectedActivity
        ? group.activities.some((act) => act.id === selectedActivity.id)
        : false;

      const contentEl = document.createElement('div');
      contentEl.className = 'cursor-pointer select-none';

      if (isSelected) {
        // [A] 선택된 상태: 상품 개수 상관없이 bounce 효과가 들어간 브랜드 컬러(primary) 위치 핀 아이콘 표시
        // 겹침 상품인 경우 핀 오른쪽 상단에 개수 배지 표시
        const badgeMarkup =
          group.activities.length > 1
            ? `<div class="absolute -top-1.5 -right-1.5 bg-white border-2 border-primary text-primary text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">${group.activities.length}</div>`
            : '';

        contentEl.innerHTML = `
          <div class="relative flex flex-col items-center origin-bottom transform -translate-y-full -mt-2">
            <div class="animate-bounce relative">
              <svg class="w-8 h-10 text-primary drop-shadow-[0_4px_6px_rgba(0,195,255,0.35)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5"/>
              </svg>
              ${badgeMarkup}
            </div>
            <div class="w-2.5 h-1.5 bg-primary/30 rounded-full blur-[1px] -mt-1.5"></div>
          </div>
        `;

        contentEl.addEventListener('click', (e) => {
          e.stopPropagation(); // 지도 클릭 이벤트로 전파 차단
          if (group.activities.length > 1 && selectedActivity) {
            // 그룹 상품인 경우 다음 상품으로 순환(Cycle) 선택
            const currentIndex = group.activities.findIndex(
              (act) => act.id === selectedActivity.id
            );
            const nextIndex = (currentIndex + 1) % group.activities.length;
            onSelectActivity(group.activities[nextIndex]);
          }
          mapInstance.panTo(originalPosition);
        });

        const overlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: contentEl,
          clickable: true,
          yAnchor: 1.0, // 바닥 기준
        });

        overlay.setMap(mapInstance);
        markersRef.current.push(overlay);
      } else {
        // [B] 선택되지 않은 상태
        if (group.activities.length > 1) {
          // 동일 위치에 n개의 상품이 겹쳐 있는 경우 (Pill 형태 버블)
          contentEl.innerHTML = `
            <div class="transition-all duration-200 rounded-full px-3 py-1 text-xs font-extrabold whitespace-nowrap flex items-center justify-center gap-1 bg-white border-2 border-primary text-primary hover:bg-primary-100/10 hover:scale-105 shadow-md">
              ${group.activities.length}개의 상품
            </div>
          `;

          contentEl.addEventListener('click', (e) => {
            e.stopPropagation(); // 지도 클릭 이벤트로 전파 차단
            onSelectActivity(firstAct);
            mapInstance.panTo(originalPosition);
          });

          const overlay = new window.kakao.maps.CustomOverlay({
            position: position,
            content: contentEl,
            clickable: true,
            yAnchor: 0.5, // 세로 중앙 정렬
          });

          overlay.setMap(mapInstance);
          markersRef.current.push(overlay);
        } else {
          // 단일 상품인 경우: 더 크고 직관적인 펄스 점(Dot) 마커 표시
          contentEl.innerHTML = `
            <div class="relative flex items-center justify-center w-10 h-10 hover:scale-110 transition-transform duration-200">
              <div class="absolute w-8 h-8 rounded-full bg-primary/25 animate-ping"></div>
              <div class="absolute w-7 h-7 bg-white rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.22)] border border-primary/25 flex items-center justify-center">
                <div class="w-3.5 h-3.5 bg-primary rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"></div>
              </div>
            </div>
          `;

          contentEl.addEventListener('click', (e) => {
            e.stopPropagation(); // 지도 클릭 이벤트로 전파 차단
            onSelectActivity(firstAct);
            mapInstance.panTo(originalPosition);
          });

          const overlay = new window.kakao.maps.CustomOverlay({
            position: position,
            content: contentEl,
            clickable: true,
            yAnchor: 0.5, // 세로 중앙 정렬
          });

          overlay.setMap(mapInstance);
          markersRef.current.push(overlay);
        }
      }
    });
  }, [mapInstance, activities, selectedCategory, selectedActivity, zoomLevel, onSelectActivity]);

  // 2. 사용자 위치 마커 표시 및 관리
  useEffect(() => {
    if (!mapInstance || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    const position = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
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

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
    };
  }, [mapInstance, userLocation]);
}
