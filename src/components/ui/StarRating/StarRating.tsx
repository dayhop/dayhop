import React, { useState } from 'react';

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

  // display 모드
  if (mode === 'display') {
    const formattedRating = rating.toFixed(1);
    return (
      <div className="inline-flex items-center gap-1">
        <span className="text-sm text-yellow-400">★</span>
        <span className="text-sm font-semibold text-gray-800">{formattedRating}</span>
        {reviewCount !== undefined && (
          <span className="text-sm text-gray-400">({reviewCount})</span>
        )}
      </div>
    );
  }

  // interactive 모드
  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= activeRating;

        return (
          <button
            key={starValue}
            type="button"
            className="text-2xl transition-transform focus:outline-none active:scale-90"
            onClick={() => onChange && onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(null)}
            aria-label={`${starValue}점 주기`}
          >
            <span className={isFilled ? 'text-yellow-400' : 'text-gray-300'}>
              {isFilled ? '★' : '☆'}
            </span>
          </button>
        );
      })}
    </div>
  );
};
