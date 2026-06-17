'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MyActivityCard } from './MyActivityCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { deleteMyActivity } from '@/lib/api/my-activities';
import { showToast } from '@/utils/toast';
import type { ActivityItem } from '@/types/api';

interface MyActivitiesListProps {
  activities: ActivityItem[];
}

export const MyActivitiesList = ({ activities }: MyActivitiesListProps) => {
  const router = useRouter();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    await deleteMyActivity(deleteTargetId);
    showToast.success('체험이 삭제되었습니다.');
    router.refresh();
    setDeleteTargetId(null);
  };

  return (
    <>
      <ul className="flex flex-col gap-4">
        {activities.map((activity) => (
          <li key={activity.id}>
            <MyActivityCard
              activity={activity}
              onEdit={() => router.push(`/activity-edit/${activity.id}`)}
              onDelete={() => setDeleteTargetId(activity.id)}
            />
          </li>
        ))}
      </ul>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        message={`체험을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
};
