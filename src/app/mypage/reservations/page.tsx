import { getMyReservations } from '@/lib/api/my-reservations';
import { ReservationStatus } from '@/lib/api/my-reservations/type';
import { unwrap } from '@/lib/api/safeApi';
import { ReservationListClient } from '@/components/blocks/ReservationList/ReservationListClient';
import { ReservationFilterButton } from '@/components/blocks/ReservationList/NavigationButton';

const VALID_STATUSES: ReservationStatus[] = [
  'pending',
  'confirmed',
  'declined',
  'canceled',
  'completed',
];

export default async function ReservationListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatus = VALID_STATUSES.includes(status as ReservationStatus)
    ? (status as ReservationStatus)
    : undefined;

  const { reservations, cursorId } = unwrap(
    await getMyReservations({ size: 10, status: validStatus })
  );

  return (
    <ReservationListClient
      key={status ?? 'all'}
      initialReservations={reservations}
      initialCursorId={cursorId}
      activeStatus={(status as ReservationFilterButton) ?? 'all'}
    />
  );
}
