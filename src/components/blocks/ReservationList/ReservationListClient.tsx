'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyReservations } from '@/lib/api/my-reservations';
import { Reservation, ReservationStatus } from '@/lib/api/my-reservations/type';
import { showToast } from '@/utils/toast';
import { NavigationButton, ReservationFilterButton } from './NavigationButton';
import { ReservationCard } from './ReservationCard';

const GET_SIZE = 10;

interface ReservationListClientProps {
  initialReservations: Reservation[];
  initialCursorId: number | null;
  activeStatus: ReservationFilterButton;
}

export const ReservationListClient = ({
  initialReservations,
  initialCursorId,
  activeStatus,
}: ReservationListClientProps) => {
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);
  const [reservationList, setReservationList] = useState<Reservation[]>(initialReservations);
  const [cursorId, setCursorId] = useState<number | null>(initialCursorId);
  const [hasMore, setHasMore] = useState(initialCursorId !== null);
  const [isLoading, setIsLoading] = useState(false);

  const onClickNavigationButton = (button: ReservationFilterButton) => {
    if (button === 'all') {
      router.push('/mypage/reservations');
    } else {
      router.push(`/mypage/reservations?status=${button}`);
    }
  };

  // 무한 스크롤
  useEffect(() => {
    if (!observerRef.current || isLoading || !hasMore) return;

    const fetchData = async () => {
      if (isLoading || !hasMore || !cursorId) return;
      setIsLoading(true);
      const params: { size: number; cursorId?: number; status?: ReservationStatus } = {
        size: GET_SIZE,
        cursorId,
      };
      if (activeStatus !== 'all') {
        params.status = activeStatus as ReservationStatus;
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
              <ReservationCard key={reservation.id} data={reservation} />
            ))
          : !isLoading && (
              <div className="py-10 text-center text-gray-500">예약 내역이 없습니다.</div>
            )}
        {isLoading && <div className="py-4 text-center text-gray-500">불러오는 중...</div>}
      </div>
      {hasMore && <div ref={observerRef} className="h-4" />}
    </div>
  );
};
