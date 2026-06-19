import { getMyActivities } from '@/lib/api/my-activities';
import { unwrap } from '@/lib/api/safeApi';
import { MyActivitiesList } from '@/components/blocks/MyActivities';

export default async function ExperiencesPage() {
  const { activities, cursorId } = unwrap(await getMyActivities());

  return <MyActivitiesList activities={activities} cursorId={cursorId} />;
}
