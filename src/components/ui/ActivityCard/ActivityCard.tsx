'use client';

import Image from 'next/image';
import Link from 'next/link';

import { StarRating } from '@/components/ui/StarRating';
import { useClickLogger } from '@/hooks/useClickLogger';
import { useClickRecent } from '@/hooks/useClickRecent';

import type { ActivityItem } from '@/lib/api/activities/type';

interface HoverReview {
  nickname: string;
  rating: number;
  content: string;
}

interface ActivityCardProps {
  activity: ActivityItem;
  hoverReview?: HoverReview;
  onClick?: () => void;
}

export const ActivityCard = ({ activity, hoverReview, onClick }: ActivityCardProps) => {
  return (
    <Link
      href={`/activities/${activity.id}`}
      onClick={onClick}
      className="group block w-full overflow-hidden rounded-[32px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
    >
      <div className="relative aspect-[262/230] w-full overflow-hidden">
        <Image
          src={activity.bannerImageUrl}
          alt={activity.title}
          fill
          sizes="(max-width: 1280px) 50vw, 262px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/60" />

        <div className="absolute inset-0 z-10 flex items-start justify-center px-5 pt-6 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
          {hoverReview ? (
            <div className="w-full">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">{hoverReview.nickname}</p>
                <p className="text-sm font-semibold">⭐ {hoverReview.rating.toFixed(1)}</p>
              </div>

              <p className="mt-4 line-clamp-3 text-left text-sm leading-6 font-medium">
                {hoverReview.content}
              </p>
            </div>
          ) : (
            <p className="text-sm font-medium">아직 등록된 리뷰가 없습니다.</p>
          )}
        </div>
      </div>

      <div className="relative -mt-[16%] rounded-t-[32px] bg-white px-[9%] py-[7%]">
        <h3 className="mb-2 line-clamp-1 text-base font-bold text-gray-900">{activity.title}</h3>

        <StarRating rating={activity.rating} reviewCount={activity.reviewCount} />

        <p className="mt-[6%] text-base font-bold text-gray-900">
          ₩ {activity.price.toLocaleString()}
          <span className="ml-1 text-sm font-normal text-gray-400">/ 인</span>
        </p>
      </div>
    </Link>
  );
};
