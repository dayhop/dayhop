import { getMyActivities } from '@/lib/api/my-activities';
import { MyActivitiesList } from '@/components/blocks/MyActivities';

export default async function ExperiencesPage() {
  const { activities, cursorId } = await getMyActivities();

  return <MyActivitiesList activities={activities} cursorId={cursorId} />;
}
