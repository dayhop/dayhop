'use client';

import { ActivityItem } from '@/types/api';
import { totalPriceToString } from '@/utils/priceFormat';
import Image from 'next/image';
import IconStar from '@/assets/icon/icon-star.svg';
import { useRouter } from 'next/navigation';
import { useClickRecent } from '@/hooks/useClickRecent';
import { useClickLogger } from '@/hooks/useClickLogger';

export function FloatingViewCard({ activity }: { activity: ActivityItem }) {
  const router = useRouter();
  const { handleUpdateRecentClick } = useClickRecent();
  const { handleUpdateLog } = useClickLogger();
  const { bannerImageUrl, price, rating, category, title, id } = activity;
  const priceformat = totalPriceToString(price);
  return (
    <div
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-50 p-3 transition-all duration-300 ease-out hover:border-gray-100 hover:bg-gray-50 hover:shadow-sm"
      onClick={() => {
        router.push(`/activities/${id}`);
        handleUpdateLog(id, category);
        handleUpdateRecentClick(id);
      }}
    >
      <Image
        src={bannerImageUrl}
        alt="체험 배너 이미지"
        width={80}
        height={80}
        className="rounded-xl object-cover"
      />
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className="text-primary w-max rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold">
          {category}
        </span>
        <span className="group-hover:text-primary-button-active line-clamp-2 text-[14px] leading-snug font-medium text-gray-900 transition-colors">
          {title}
        </span>
        <div className="mt-0.5 flex items-center gap-3">
          <span className="text-[15px] font-bold text-gray-950">{priceformat}</span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <IconStar className="w-3" />
            {rating}
          </div>
        </div>
      </div>
    </div>
  );
}
