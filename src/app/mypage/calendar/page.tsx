import { getMyActivities } from '@/lib/api/my-activities';
import { unwrap } from '@/lib/api/safeApi';
import { CalendarStatusSection } from '@/components/blocks/CalendarStatusSection';

export default async function CalendarPage() {
  const { activities } = unwrap(await getMyActivities());

  return <CalendarStatusSection initialActivities={activities} />;
}
