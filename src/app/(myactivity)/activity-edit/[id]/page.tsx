import { ActivityEdit } from '@/components/blocks/ActivityForm/ActivityEdit/ActivityEdit';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activityId = Number(id);
  return <ActivityEdit activityId={activityId} />;
}
