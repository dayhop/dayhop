import { useState } from 'react';
import IconStar from '@/assets/icons/icon_star.svg';

export interface StarRatingProps {
  mode?: 'display' | 'interactive';
  rating?: number;
  reviewCount?: number;
  onChange?: (rating: number) => void;
  maxStars?: number;
  className?: string;
}

export const StarRating = ({
  mode = 'display',
  rating = 0,
  reviewCount,
  onChange,
  maxStars = 5,
  className = '',
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // display 모드 (표시용)
  if (mode === 'display') {
    const formattedRating = rating.toFixed(1);
    return (
      <div
        className={`inline-flex items-center gap-1 ${className}`}
        aria-label={`평점 ${formattedRating}점`}
      >
        <IconStar className="text-yellow h-4 w-4 [&_path]:fill-current" />
        <span className="text-text-primary text-sm font-semibold">{formattedRating}</span>
        {reviewCount !== undefined && (
          <span className="text-text-tertiary text-sm">({reviewCount})</span>
        )}
      </div>
    );
  }

  // interactive 모드 (입력용)
  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div
      role="radiogroup"
      aria-label="별점 평가"
      className={`inline-flex items-center gap-1 ${className}`}
      onMouseLeave={() => setHoverRating(null)}
    >
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isHighlighted = starValue <= activeRating;

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={rating === starValue}
            aria-label={`별 ${starValue}개`}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onFocus={() => setHoverRating(starValue)}
            onBlur={() => setHoverRating(null)}
            className="text-text-tertiary focus-visible:ring-primary cursor-pointer rounded-md p-0.5 transition-all duration-150 focus:outline-none focus-visible:ring-2"
          >
            <IconStar
              className={`h-6 w-6 transition-colors duration-150 [&_path]:fill-current ${
                isHighlighted ? 'text-yellow' : 'text-text-tertiary'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
