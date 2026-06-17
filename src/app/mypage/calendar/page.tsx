import { getMyActivities } from '@/lib/api/my-activities';
import { CalendarBoard } from '@/components/blocks/CalendarBoard';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';

export default async function CalendarPage() {
  const { activities } = await getMyActivities();

  if (activities.length === 0) {
    return <EmptyState message="등록된 체험이 없습니다." />;
  }

  return <CalendarBoard activityId={activities[0].id} />;
}
