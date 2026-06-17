import { getMyActivities } from '@/lib/api/my-activities';
import { MyActivitiesHeader, MyActivitiesList } from '@/components/blocks/MyActivities';

export default async function ExperiencesPage() {
  const { activities, cursorId } = await getMyActivities();

  return (
    <div className="flex flex-col gap-6">
      <MyActivitiesHeader />
      <MyActivitiesList activities={activities} cursorId={cursorId} />
    </div>
  );
}
