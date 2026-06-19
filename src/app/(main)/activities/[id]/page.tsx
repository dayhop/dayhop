import { getActivity } from '@/lib/api/activities';
import { ActivityDetailClient } from '@/components/blocks/ActivityDetailClient';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout';

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activityId = parseInt(id, 10);

  if (isNaN(activityId)) {
    notFound();
  }

  const res = await getActivity(activityId);

  if (!res.success) {
    notFound();
  }

  const activity = res.data;

  const processedActivity = {
    ...activity,
    subImages: activity.subImages || [],
    schedules: activity.schedules || [],
  };

  return (
    <>
      <Header />
      <ActivityDetailClient activity={processedActivity} />
    </>
  );
}
