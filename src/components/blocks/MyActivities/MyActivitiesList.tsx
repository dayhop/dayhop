'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MyActivityCard } from './MyActivityCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { deleteMyActivity, getMyActivities } from '@/lib/api/my-activities';
import { showToast } from '@/utils/toast';
import type { ActivityItem } from '@/types/api';

interface MyActivitiesListProps {
  activities: ActivityItem[];
  cursorId: number | null;
}

export const MyActivitiesList = ({
  activities: initialActivities,
  cursorId: initialCursorId,
}: MyActivitiesListProps) => {
  const router = useRouter();
  const [activities, setActivities] = useState(initialActivities);
  const [cursorId, setCursorId] = useState(initialCursorId);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorId) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoading) return;
        setIsLoading(true);
        const { activities: next, cursorId: nextCursor } = await getMyActivities({ cursorId });
        setActivities((prev) => [...prev, ...next]);
        setCursorId(nextCursor);
        setIsLoading(false);
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursorId, isLoading]);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    await deleteMyActivity(deleteTargetId);
    setActivities((prev) => prev.filter((a) => a.id !== deleteTargetId));
    showToast.success('체험이 삭제되었습니다.');
    setDeleteTargetId(null);
  };

  if (activities.length === 0) {
    return <EmptyState message="아직 등록한 체험이 없습니다." />;
  }

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

      {cursorId && <div ref={observerRef} className="h-4" />}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        message="체험을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
};
