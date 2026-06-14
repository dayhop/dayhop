import type { GetMyActivityReservationsParams } from '@/lib/api/my-activities/type';
import { ReservationActionBadge } from './ReservationActionBadge';
import { ReservationStateBadge } from '@/components/ui/ReservationList';

type TabStatus = GetMyActivityReservationsParams['status'];

interface ReservationItemProps {
  nickname: string;
  headCount: number;
  activeTab: TabStatus;
  isPast?: boolean;
  onApprove?: () => void;
  onDecline?: () => void;
}

export const ReservationItem = ({
  nickname,
  headCount,
  activeTab,
  isPast,
  onApprove,
  onDecline,
}: ReservationItemProps) => {
  return (
    <li className="flex items-center justify-between gap-2 rounded-2xl border border-gray-100 px-4 py-3.5">
      <ul className="flex min-w-0 flex-1 flex-col gap-2.5 text-sm lg:text-base">
        <li className="flex min-w-0 gap-2">
          <span className="min-w-9 font-bold text-gray-500 lg:min-w-10.5">닉네임</span>
          <span className="text-text-primary min-w-0 flex-1 truncate font-medium" title={nickname}>
            {nickname}
          </span>
        </li>
        <li className="flex min-w-0 gap-2">
          <span className="min-w-9 font-bold text-gray-500 lg:min-w-10.5">인원</span>
          <span className="text-text-primary min-w-0 flex-1 truncate font-medium">
            {headCount}명
          </span>
        </li>
      </ul>

      <div className="shrink-0">
        {activeTab === 'pending' &&
          (isPast ? (
            <div className="inline-flex w-fit items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-[13px] font-bold text-gray-500">
              종료
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <ReservationActionBadge action="confirmed" onClick={onApprove} />
              <ReservationActionBadge action="declined" onClick={onDecline} />
            </div>
          ))}

        {activeTab === 'confirmed' && <ReservationStateBadge reservationState="confirmed" />}
        {activeTab === 'declined' && <ReservationStateBadge reservationState="declined" />}
      </div>
    </li>
  );
};
