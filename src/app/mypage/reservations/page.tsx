import { getMyReservations } from '@/lib/api/my-reservations';
import { ReservationCard } from '@/components/blocks/ReservationList/ReservationCard';
import { EmptyReservationList } from '@/components/blocks/ReservationList/EmptyReservationList';

export default async function ReservationsPage() {
  const { reservations } = await getMyReservations({});

  if (reservations.length === 0) {
    return <EmptyReservationList />;
  }

  return (
    <ul className="flex flex-col gap-4">
      {reservations.map((r) => (
        <li key={r.id}>
          <ReservationCard
            title={r.activity.title}
            date={r.date}
            startTime={r.startTime}
            endTime={r.endTime}
            totalPrice={r.totalPrice}
            status={r.status}
            headCount={r.headCount}
            bannerImageUrl={r.activity.bannerImageUrl}
          />
        </li>
      ))}
    </ul>
  );
}
