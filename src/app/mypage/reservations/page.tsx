'use client';

import {
  NavigationButton,
  ReservationFilterButton,
} from '@/components/blocks/ReservationList/NavigationButton';
import { ReservationCard } from '@/components/blocks/ReservationList/ReservationCard';

import { getMyReservations } from '@/lib/api/my-reservations';
import { Reservation, ReservationStatus } from '@/lib/api/my-reservations/type';
import { showToast } from '@/utils/toast';
import { useEffect, useRef, useState } from 'react';

type Params = {
  size: number;
  status?: ReservationStatus;
  cursorId?: number;
};
const GET_SIZE = 10;

export default function ReservationListPage() {
  const observerRef = useRef<HTMLDivElement>(null);
  const [activeStatus, setActiveStatus] = useState<ReservationFilterButton>('all');
  const [reservationList, setReservationList] = useState<Reservation[]>([]);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onClickNavigationButton = (button: ReservationFilterButton) => {
    setActiveStatus(button);
  };

  const handleDelete = (id: number) => {
    setReservationList((prev) => prev.filter((r) => r.id !== id));
  };

  // 필터 변경 시
  useEffect(() => {
    //바로 한 번 초기화
    const initialData = () => {
      setReservationList([]);
      setCursorId(null);
      setHasMore(true);
    };
    initialData();

    const fetchInitialData = async () => {
      setIsLoading(true);
      const params: Params = { size: GET_SIZE };
      if (activeStatus !== 'all') {
        params.status = activeStatus;
      }
      //초기 데이터
      const res = await getMyReservations(params);
      if (!res.success) {
        showToast.error(res.message);
        setIsLoading(false);
        return;
      }
      setReservationList(res.data.reservations);
      setCursorId(res.data.cursorId);
      setHasMore(res.data.cursorId !== null);
      setIsLoading(false);
    };

    fetchInitialData();
  }, [activeStatus]);

  // 스크롤
  useEffect(() => {
    if (!observerRef.current || isLoading || !hasMore) return;

    const fetchData = async () => {
      if (isLoading || !hasMore || !cursorId) return;
      setIsLoading(true);
      const params: Params = { size: GET_SIZE, cursorId };
      if (activeStatus !== 'all') {
        params.status = activeStatus;
      }
      const res = await getMyReservations(params);
      if (!res.success) {
        showToast.error(res.message);
        setIsLoading(false);
        return;
      }
      setReservationList((prev) => [...prev, ...res.data.reservations]);
      setCursorId(res.data.cursorId);
      setHasMore(res.data.cursorId !== null);
      setIsLoading(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        //div보이면 fetch실행
        if (entries[0].isIntersecting) fetchData();
      },
      { threshold: 0.2 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [activeStatus, cursorId, hasMore, isLoading]);

  return (
    <div className="flex flex-col gap-3.5">
      <NavigationButton activeStatus={activeStatus} onClickButton={onClickNavigationButton} />
      <div className="flex flex-col gap-7.5 px-6 md:px-0">
        {reservationList.length !== 0
          ? reservationList.map((reservation) => (
              <ReservationCard key={reservation.id} data={reservation} onDelete={handleDelete} />
            ))
          : !isLoading && (
              <div className="py-10 text-center text-gray-500">예약 내역이 없습니다.</div>
            )}
        {isLoading && <div className="py-4 text-center text-gray-500">불러오는 중...</div>}
      </div>
      {hasMore && <div ref={observerRef} className="h-4" />}
    </div>
  );
}
