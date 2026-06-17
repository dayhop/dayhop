'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ActivityDetailMapProps {
  address: string;
}

export const ActivityDetailMap = ({ address }: ActivityDetailMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_JS_API_KEY;
  const [loadError, setLoadError] = useState(!kakaoApiKey);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sdkReady) {
        setLoadError(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [sdkReady]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setSdkReady(true);
      });
      return;
    }

    if (!kakaoApiKey) {
      console.warn('[ActivityDetailMap] Kakao API key is missing.');
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

  useEffect(() => {
    if (!sdkReady || !mapContainerRef.current) return;

    const container = mapContainerRef.current;
    //서울
    const defaultCenter = new window.kakao.maps.LatLng(37.5665, 126.978);

    const options = {
      center: defaultCenter,
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        const coords = new window.kakao.maps.LatLng(
          parseFloat(result[0].y),
          parseFloat(result[0].x)
        );

        const marker = new window.kakao.maps.Marker({
          position: coords,
        });
        marker.setMap(map);

        map.setCenter(coords);
      } else {
        console.warn(
          `[ActivityDetailMap] Failed to geocode address: ${address}. Using default center.`
        );

        const defaultMarker = new window.kakao.maps.Marker({
          position: defaultCenter,
        });
        defaultMarker.setMap(map);
      }
    });
  }, [sdkReady, address]);

  if (loadError) {
    return (
      <div className="border-border-default text-text-tertiary flex h-[360px] w-full items-center justify-center rounded-2xl border bg-gray-50">
        지도를 로드할 수 없습니다. (API 키 오류 또는 오프라인 상태)
      </div>
    );
  }

  return (
    <div className="border-border-default relative z-0 w-full overflow-hidden rounded-2xl border shadow-sm">
      <div ref={mapContainerRef} className="h-[360px] w-full" style={{ minHeight: '360px' }} />
    </div>
  );
};
