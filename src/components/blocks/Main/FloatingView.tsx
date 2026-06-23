'use client';

import { useEffect, useState } from 'react';
import EyeOnIcon from '@/assets/icon/EyeOnIcon.svg';
import CloseIcon from '@/assets/icon/CloseIcon.svg';
import { getActivity } from '@/lib/api/activities';
import { ActivityItem } from '@/types/api';
import { ActivityResponse } from '@/lib/api/activities/type';
import { FloatingViewCard } from './FloatingViewCard';
import { getMyUser } from '@/lib/api/users';
import { EmptyState } from '@/components/ui/EmptyState';

export function FloatingRecentViews() {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState<string>('');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  useEffect(() => {
    //먼저 로컬 스토리지에 접근해서 list를 가져옴
    const getUserClickRecent = async () => {
      const idList = localStorage.getItem('recentActivities');
      if (!idList) return;
      try {
        const userClickActivities = JSON.parse(idList);
        const results = await Promise.all(
          userClickActivities.map((activityId: number) => getActivity(Number(activityId)))
        );
        const data = results
          .filter((r): r is { success: true; data: ActivityResponse } => r.success)
          .map((r) => r.data);
        setActivities(data);
      } catch (error) {
        console.error('Failed to parse or fetch recent activities:', error);
      }
    };
    getUserClickRecent();
    const getNickname = async () => {
      try {
        const res = await getMyUser();
        if (res.success) setNickname(res.data.nickname);
      } catch (error) {
        console.error('Failed to fetch user nickname:', error);
      }
    };
    getNickname();
    window.addEventListener('recentActivitiesUpdated', getUserClickRecent);
    return () => {
      window.removeEventListener('recentActivitiesUpdated', getUserClickRecent);
    };
  }, []);

  return (
    <aside
      className={`fixed top-1/4 right-0 z-40 flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* --- 플로팅 버튼 --- */}
      <div className="absolute top-0 right-full mr-4">
        <div className="group relative">
          <div className="pointer-events-none absolute right-full mr-4 w-max scale-95 rounded-xl border border-gray-100 bg-white/90 px-4 py-2.5 text-sm opacity-0 shadow-xl backdrop-blur-sm transition-all group-hover:-translate-x-1 group-hover:scale-100 group-hover:opacity-100">
            <p className="font-medium text-gray-800">
              <span
                className={`${nickname !== '' ? 'text-primary font-bold' : 'text-text-primary'}`}
              >
                {nickname || '회원'}
              </span>
              님이 방금 살펴본 체험!
            </p>
          </div>

          {/* 토글 버튼 */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="from-primary to-primary-button-hover flex w-16 flex-col items-center gap-2 rounded-full border border-white/20 bg-linear-to-b py-4 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(59,130,246,0.3)]"
            aria-label="최근 본 체험 목록 열기"
          >
            <EyeOnIcon className="fill-white" />
            <span className="text-xs font-bold tracking-tight">최근 본</span>
          </button>
        </div>
      </div>

      {/* --- 슬라이드 패널 영역 --- */}
      <div className="flex h-125 w-90 flex-col overflow-hidden rounded-l-3xl border border-gray-100 bg-white shadow-[-10px_0_60px_rgba(0,0,0,0.1)]">
        {/* 패널 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="text-primary rounded-lg bg-blue-50 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8V12L15 15" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">최근 구경한 체험</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="group rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100"
            aria-label="닫기"
          >
            <CloseIcon className="fill-text-tertiary" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {activities?.length > 0 ? (
            activities.map((activity) => <FloatingViewCard key={activity.id} activity={activity} />)
          ) : (
            //데이터 없을 때
            <div className="flex flex-col items-center justify-center gap-3 pt-10 pb-6 text-center text-gray-400">
              <EmptyState message="아직 둘러본 체험이 없어요" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
