'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MyActivityCard } from './MyActivityCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
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
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const isLoadingRef = useRef(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorId) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoadingRef.current) return;
        isLoadingRef.current = true;
        setIsFetchingMore(true);
        const res = await getMyActivities({ cursorId });
        isLoadingRef.current = false;
        setIsFetchingMore(false);
        if (res.success) {
          setActivities((prev) => [...prev, ...res.data.activities]);
          setCursorId(res.data.cursorId);
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursorId]);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const res = await deleteMyActivity(deleteTargetId);
    if (!res.success) {
      showToast.error(res.message);
      setDeleteTargetId(null);
      return;
    }
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

      {cursorId && (
        <div ref={observerRef} className="flex h-10 items-center justify-center">
          {isFetchingMore && <Spinner className="text-primary" />}
        </div>
      )}

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
