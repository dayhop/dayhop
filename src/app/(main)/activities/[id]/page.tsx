import { getActivity } from '@/lib/api/activities';
import { ActivityDetailClient } from '@/components/blocks/ActivityDetailClient';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout';

export default async function ActivityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ owner?: string }>;
}) {
  const { id } = await params;
  const activityId = parseInt(id, 10);
  const resolvedSearchParams = (await searchParams) || {};

  if (isNaN(activityId)) {
    notFound();
  }

  const activity = await getActivity(activityId);
  const isMockOwner = resolvedSearchParams.owner === 'true';

  if (!activity) {
    notFound();
  }

  // If testing owner mode on a real activity, override userId
  const processedActivity = {
    ...activity,
    userId: isMockOwner ? -1 : activity.userId,
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
