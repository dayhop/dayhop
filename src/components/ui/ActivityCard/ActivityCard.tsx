import Image from 'next/image';

import { StarRating } from '@/components/ui/StarRating';
import { useClickLogger } from '@/hooks/useClickLogger';
import { useClickMost } from '@/hooks/useClickMost';

import type { ActivityItem } from '@/lib/api/activities/type';

interface ActivityCardProps {
  activity: ActivityItem;
  onClick?: () => void;
}

export const ActivityCard = ({ activity, onClick }: ActivityCardProps) => {
  const { handleUpdateLog } = useClickLogger();
  const { handleUpdateMostClick } = useClickMost();

  const handleClick = () => {
    handleUpdateLog(activity.id, activity.category);
    handleUpdateMostClick(activity.id);
    onClick?.();
  };

  return (
    <article
      className="w-[262px] cursor-pointer overflow-hidden rounded-[32px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
      onClick={handleClick}
    >
      <div className="relative h-[230px] w-full overflow-hidden">
        <Image
          src={activity.bannerImageUrl}
          alt={activity.title}
          fill
          sizes="262px"
          className="object-cover"
        />
      </div>

      <div className="relative -mt-[42px] rounded-t-[32px] bg-white px-[24px] pt-[18px] pb-[18px]">
        <h3 className="mb-2 line-clamp-1 text-[16px] font-bold text-gray-900">{activity.title}</h3>

        <StarRating rating={activity.rating} reviewCount={activity.reviewCount} />

        <p className="mt-4 text-[16px] font-bold text-gray-900">
          ₩ {activity.price.toLocaleString()}
          <span className="ml-1 text-[14px] font-normal text-gray-400">/ 인</span>
        </p>
      </div>
    </article>
  );
};
