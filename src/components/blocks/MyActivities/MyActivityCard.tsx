import Image from 'next/image';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { totalPriceToString } from '@/utils/priceFormat';
import type { ActivityItem } from '@/types/api';

interface MyActivityCardProps {
  activity: ActivityItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const MyActivityCard = ({ activity, onEdit, onDelete }: MyActivityCardProps) => {
  return (
    <div className="shadow-card flex items-center justify-between gap-4 rounded-2xl bg-white p-4">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="text-text-primary truncate text-[15px] font-bold">{activity.title}</h3>
        <StarRating rating={activity.rating} reviewCount={activity.reviewCount} />
        <p className="text-text-primary text-[15px] font-bold">
          {totalPriceToString(activity.price)}
          <span className="text-text-tertiary ml-1 text-[13px] font-normal">/ 인</span>
        </p>
        <div className="mt-1 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-auto px-3 text-[13px] whitespace-nowrap hover:bg-gray-50 active:bg-gray-100"
            onClick={onEdit}
          >
            수정하기
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="w-auto px-3 text-[13px] whitespace-nowrap hover:bg-gray-50 active:bg-gray-100"
            onClick={onDelete}
          >
            삭제하기
          </Button>
        </div>
      </div>
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={activity.bannerImageUrl}
          alt={activity.title}
          fill
          sizes="96px"
          quality={80}
          className="object-cover"
        />
      </div>
    </div>
  );
};
