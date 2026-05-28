import React, { useState } from 'react';
import IconStar from '@/assets/icons/icon_star.svg';

export interface StarRatingProps {
  mode?: 'display' | 'interactive';
  rating?: number;
  reviewCount?: number;
  onChange?: (rating: number) => void;
  maxStars?: number;
}

export const StarRating = ({
  mode = 'display',
  rating = 0,
  reviewCount,
  onChange,
  maxStars = 5,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // display 모드 (표시용)
  if (mode === 'display') {
    const formattedRating = rating.toFixed(1);
    return (
      <div className="inline-flex items-center gap-1">
        <IconStar className="text-yellow h-4 w-4 [&_path]:fill-current" />
        <span className="text-sm font-semibold text-gray-800">{formattedRating}</span>
        {reviewCount !== undefined && (
          <span className="text-sm text-gray-400">({reviewCount})</span>
        )}
      </div>
    );
  }

  // interactive 모드 (입력용)
  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1" onMouseLeave={() => setHoverRating(null)}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isHighlighted = starValue <= activeRating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            className="cursor-pointer p-0.5 transition-colors duration-150 focus:outline-none"
          >
            <IconStar
              className={`h-6 w-6 transition-colors duration-150 [&_path]:fill-current ${
                isHighlighted ? 'text-yellow' : 'text-gray-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
