'use client';

import { StarRating } from '@/components/ui/StarRating';
import { useClickLogger } from '@/hooks/useClickLogger';
import { useClickRecent } from '@/hooks/useClickRecent';
import { ActivityCategory } from '@/types/api';
import { totalPriceToString } from '@/utils/priceFormat';
import { useRouter } from 'next/navigation';

interface MainActivityCardProps {
  data: {
    id: number;
    category: ActivityCategory;
    title: string;
    price: number;
    bannerImageUrl: string;
    rating: number;
    reviewCount: number;
  };
}

export function MainActivityCard({ data }: MainActivityCardProps) {
  const router = useRouter();
  const { handleUpdateRecentClick } = useClickRecent();
  const { handleUpdateLog } = useClickLogger();

  const { id, title, price, bannerImageUrl, rating, reviewCount, category } = data;

  if (!bannerImageUrl) {
    return <div className="h-45 w-46.5 animate-pulse rounded-2xl bg-gray-200 md:h-96 md:w-96" />;
  }

  return (
    <div
      className="text-bg group relative h-45 w-46.5 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-cover bg-center pr-5 pb-3 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] md:h-96 md:w-96 md:rounded-[20px] md:px-5 md:py-7.5"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)), url("${bannerImageUrl}")`,
      }}
      onClick={() => {
        handleUpdateLog(id, category);
        handleUpdateRecentClick(id);
        router.push(`/activities/${id}`);
      }}
    >
      <div className="absolute inset-0 z-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />

      <div className="absolute bottom-3 left-0 z-10 flex flex-col gap-1.5 px-4 md:bottom-7.5 md:left-5 md:gap-5">
        <StarRating rating={rating} reviewCount={reviewCount} className="[&_span]:text-white" />
        <div className="text-lg font-bold md:text-4xl md:leading-10.5">{title}</div>
        <div className="flex items-center gap-1">
          <span className="text-md font-bold md:text-xl">{`₩ ${totalPriceToString(price)}`}</span>
          <span className="leading-6 text-[#A1A1A1]">/ 인</span>
        </div>
      </div>
    </div>
  );
}
