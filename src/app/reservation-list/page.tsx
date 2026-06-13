'use client';

import {
  NavigationButton,
  ReservationFilterButton,
} from '@/components/blocks/ReservationList/NavigationButton';
import { ReservationCard } from '@/components/blocks/ReservationList/ReservationCard';

import { getMyReservations } from '@/lib/api/my-reservations';
import { Reservation } from '@/lib/api/my-reservations/type';
import { useEffect, useState } from 'react';

export default function ReservationListPage() {
  const [activeStatus, setActiveStatus] = useState<ReservationFilterButton>('all');
  const [reservationList, setReservationList] = useState<Reservation[]>([]);

  const onClickNavigationButton = (button: ReservationFilterButton) => {
    setActiveStatus(button);
  };

  const getReservationList = async () => {
    const params = activeStatus === 'all' ? {} : { status: activeStatus };
    const response = await getMyReservations(params);
    setReservationList(response.reservations);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getReservationList();
      } catch (error) {
        console.error('데이터를 불러오지 못했습니다:', error);
      }
    };
    fetchData();
  }, [activeStatus]);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="my-2.5 flex flex-col gap-2.5">
        <div className="text-lg font-semibold">예약내역</div>
        <div className="text-text-tertiary text-sm">예약내역 변경 및 취소할 수 있습니다.</div>
      </div>
      <NavigationButton activeStatus={activeStatus} onClickButton={onClickNavigationButton} />
      <div className="flex flex-col gap-7.5">
        {reservationList.length !== 0 &&
          reservationList.map((reservation) => (
            <ReservationCard key={reservation.id} data={reservation} />
          ))}
      </div>
    </div>
  );
}
