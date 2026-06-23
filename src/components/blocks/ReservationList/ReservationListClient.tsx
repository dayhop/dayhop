'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyReservations } from '@/lib/api/my-reservations';
import { Reservation, ReservationStatus } from '@/lib/api/my-reservations/type';
import { showToast } from '@/utils/toast';
import { NavigationButton, ReservationFilterButton } from './NavigationButton';
import { ReservationCard } from './ReservationCard';
import { EmptyState } from '@/components/ui/EmptyState';

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
  const isFetchingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [reservationList, setReservationList] = useState<Reservation[]>(initialReservations);
  const [cursorId, setCursorId] = useState<number | null>(initialCursorId);

  const onClickNavigationButton = (button: ReservationFilterButton) => {
    if (button === 'all') {
      router.push('/mypage/reservations');
    } else {
      router.push(`/mypage/reservations?status=${button}`);
    }
  };

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node || !cursorId) return;

      const fetchData = async () => {
        if (isFetchingRef.current || !cursorId) return;
        isFetchingRef.current = true;
        const params: { size: number; cursorId: number; status?: ReservationStatus } = {
          size: GET_SIZE,
          cursorId,
        };
        if (activeStatus !== 'all') {
          params.status = activeStatus as ReservationStatus;
        }
        const res = await getMyReservations(params);
        if (!res.success) {
          showToast.error(res.message);
          isFetchingRef.current = false;
          return;
        }
        setReservationList((prev) => [...prev, ...res.data.reservations]);
        setCursorId(res.data.cursorId);
        isFetchingRef.current = false;
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) fetchData();
        },
        { threshold: 0.2 }
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [activeStatus, cursorId]
  );

  const handleDelete = (id: number) => {
    setReservationList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-3.5">
      <NavigationButton activeStatus={activeStatus} onClickButton={onClickNavigationButton} />
      <div className="flex flex-col gap-7.5 px-6 md:px-0">
        {reservationList.length !== 0 ? (
          reservationList.map((reservation) => (
            <ReservationCard key={reservation.id} data={reservation} onDelete={handleDelete} />
          ))
        ) : (
          <EmptyState message="예약 내역이 없습니다." />
        )}
      </div>
      {cursorId !== null && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
};
