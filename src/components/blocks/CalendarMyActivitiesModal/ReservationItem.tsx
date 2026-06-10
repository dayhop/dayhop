import type { GetMyActivityReservationsParams } from '@/lib/api/my-activities/type';
import { ReservationActionBadge } from './ReservationActionBadge';
import { ReservationResultBadge } from './ReservationResultBadge';

type TabStatus = GetMyActivityReservationsParams['status'];

interface ReservationItemProps {
  nickname: string;
  headCount: number;
  activeTab: TabStatus;
  onApprove?: () => void;
  onDecline?: () => void;
}

export const ReservationItem = ({
  nickname,
  headCount,
  activeTab,
  onApprove,
  onDecline,
}: ReservationItemProps) => {
  return (
    <li className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3.5 lg:min-w-73">
      <ul className="flex flex-col gap-2.5 text-sm lg:text-base">
        <li className="flex gap-2">
          <span className="min-w-9 font-bold text-gray-500 lg:min-w-10.25">닉네임</span>
          <span className="text-text-primary font-medium">{nickname}</span>
        </li>
        <li className="flex gap-2">
          <span className="min-w-9 font-bold text-gray-500 lg:min-w-10.25">인원</span>
          <span className="text-text-primary font-medium">{headCount}명</span>
        </li>
      </ul>

      {activeTab === 'pending' && (
        <div className="flex flex-col gap-2">
          <ReservationActionBadge action="confirmed" onClick={onApprove} />
          <ReservationActionBadge action="declined" onClick={onDecline} />
        </div>
      )}

      {activeTab === 'confirmed' && <ReservationResultBadge status="confirmed" />}
      {activeTab === 'declined' && <ReservationResultBadge status="declined" />}
    </li>
  );
};
