'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { getActivities, getActivityReviews } from '@/lib/api/activities';
import { StarRating } from '@/components/ui/StarRating';

import type { ActivityItem, Reviews } from '@/lib/api/activities/type';

interface MainReviewItem {
  activity: ActivityItem;
  review: Reviews;
}

interface MainpageReviewProps {
  items?: MainReviewItem[];
}

export const MainpageReview = ({ items }: MainpageReviewProps) => {
  const router = useRouter();

  const [reviews, setReviews] = useState<MainReviewItem[]>(items ?? []);
  const [isLoading, setIsLoading] = useState(!items);

  const moveToActivity = (activityId: number) => {
    router.push(`/activities/${activityId}`);
  };

  useEffect(() => {
    if (items) return;

    const fetchReviews = async () => {
      try {
        const activityRes = await getActivities({
          method: 'offset',
          sort: 'most_reviewed',
          page: 1,
          size: 50,
        });

        if (!activityRes.success) {
          setReviews([]);
          return;
        }

        const activitiesWithReviews = activityRes.data.activities
          .filter((activity) => activity.reviewCount > 0)
          .slice(0, 8);

        const reviewResults = await Promise.all(
          activitiesWithReviews.map(async (activity) => {
            const reviewRes = await getActivityReviews(activity.id, {
              page: 1,
              size: 1,
            });

            if (!reviewRes.success) return null;

            const review = reviewRes.data.reviews[0];

            if (!review) return null;

            return {
              activity,
              review,
            };
          })
        );

        setReviews(
          reviewResults.filter((item): item is MainReviewItem => item !== null).slice(0, 4)
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [items]);

  if (isLoading) {
    return (
      <section className="w-full max-w-300 py-10">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">✨ Hopper들의 생생한 후기</h2>

        <div className="grid grid-cols-1 gap-y-8 min-[744px]:grid-cols-2 min-[744px]:gap-x-8 min-[1280px]:gap-x-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="flex justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-16 w-full animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-[120px] w-[84px] shrink-0 animate-pulse rounded-xl bg-gray-200" />
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="w-full max-w-300 py-10">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">✨ Hopper들의 생생한 후기</h2>

        <div className="py-8 text-center text-sm text-gray-500">등록된 후기가 없습니다.</div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-300 py-10">
      <h2 className="mb-8 text-2xl font-bold md:text-3xl">✨ Hopper들의 생생한 후기</h2>

      <div className="grid grid-cols-1 gap-y-8 min-[744px]:grid-cols-2 min-[744px]:gap-x-8 min-[1280px]:gap-x-10">
        {reviews.map((item) => (
          <article key={item.review.id} className="flex justify-between gap-3">
            <button
              type="button"
              className="min-w-0 flex-1 cursor-pointer text-left"
              onClick={() => moveToActivity(item.activity.id)}
            >
              <p className="mb-1 text-sm text-gray-400">{item.activity.category}</p>

              <h3 className="mb-2 line-clamp-2 text-base font-bold">{item.activity.title}</h3>

              <p className="line-clamp-3 text-sm leading-6 text-gray-600">{item.review.content}</p>

              <div className="mt-3 flex items-center gap-2">
                <div className="relative h-5 w-5 overflow-hidden rounded-full bg-gray-200">
                  {item.review.user.profileImageUrl && (
                    <Image
                      src={item.review.user.profileImageUrl}
                      alt={item.review.user.nickname}
                      fill
                      sizes="20px"
                      quality={80}
                      className="object-cover"
                    />
                  )}
                </div>

                <span className="text-sm">{item.review.user.nickname}</span>

                <StarRating mode="display" rating={item.review.rating} />
              </div>
            </button>

            <button
              type="button"
              className="relative h-[132px] w-[96px] shrink-0 cursor-pointer overflow-hidden rounded-xl"
              onClick={() => moveToActivity(item.activity.id)}
              aria-label={`${item.activity.title} 상세 페이지로 이동`}
            >
              <Image
                src={item.activity.bannerImageUrl}
                alt={item.activity.title}
                fill
                sizes="96px"
                quality={80}
                className="object-cover"
              />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};
