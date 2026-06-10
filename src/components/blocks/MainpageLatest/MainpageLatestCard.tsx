import Image from 'next/image';

import { StarRating } from '@/components/ui/StarRating';

interface MainpageLatestCardProps {
  title: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export default function MainpageLatestCard({
  title,
  category,
  price,
  rating,
  reviewCount,
  imageUrl,
}: MainpageLatestCardProps) {
  return (
    <article className="w-full cursor-pointer">
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-2xl">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      <StarRating rating={rating} reviewCount={reviewCount} className="mb-2" />

      <h3 className="mb-1 line-clamp-2 text-sm font-semibold">{title}</h3>

      <p className="text-text-tertiary mb-2 text-xs">{category}</p>

      <p className="text-sm font-bold">
        ₩ {price.toLocaleString()}
        <span className="text-text-tertiary ml-1 text-xs font-normal">/ 인</span>
      </p>
    </article>
  );
}
