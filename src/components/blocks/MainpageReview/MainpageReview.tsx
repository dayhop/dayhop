'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { getActivities, getActivityReviews } from '@/lib/api/activities';
import { EmptyState } from '@/components/ui/EmptyState';
import { StarRating } from '@/components/ui/StarRating';

import type { ActivityItem } from '@/types/api';
import type { Reviews } from '@/lib/api/activities/type';

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
          sort: 'latest',
          page: 1,
          size: 4,
        });

        if (!activityRes.success) {
          setReviews([]);
          return;
        }

        const reviewResults = await Promise.all(
          activityRes.data.activities.map(async (activity) => {
            const reviewRes = await getActivityReviews(activity.id, {
              page: 1,
              size: 1,
            });

            if (!reviewRes.success) return null;

            const review = reviewRes.data.reviews[0];

            if (!review) return null;

            return { activity, review };
          })
        );

        setReviews(reviewResults.filter((item): item is MainReviewItem => item !== null));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [items]);

  if (isLoading) {
    return null;
  }

  if (reviews.length === 0) {
    return (
      <section className="mx-auto w-full max-w-300 py-16 text-left">
        <h2 className="mb-4 text-lg font-bold md:text-4xl">✨ Hopper들의 생생한 후기</h2>

        <div className="flex w-full justify-center">
          <EmptyState message="등록된 리뷰가 없습니다." />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-300 py-16 text-left">
      <h2 className="mb-4 text-lg font-bold md:text-4xl">✨ Hopper들의 생생한 후기</h2>

      <div className="grid gap-y-12 min-[1280px]:grid-cols-2 min-[1280px]:gap-x-20">
        {reviews.map((item) => (
          <article key={item.review.id} className="flex justify-between gap-5">
            <button
              type="button"
              className="w-[190px] cursor-pointer text-left min-[744px]:w-[360px] min-[1280px]:w-[330px]"
              onClick={() => moveToActivity(item.activity.id)}
            >
              <p className="mb-1 text-sm text-gray-400">{item.activity.category}</p>

              <h3 className="mb-2 text-lg font-bold">{item.activity.title}</h3>

              <p className="line-clamp-4 text-sm leading-6 text-gray-600">{item.review.content}</p>

              <div className="mt-4 flex items-center gap-2">
                <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-200">
                  {item.review.user.profileImageUrl && (
                    <Image
                      src={item.review.user.profileImageUrl}
                      alt={item.review.user.nickname}
                      fill
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
              aria-label={`${item.activity.title} 상세 보기`}
              className="relative h-[160px] w-[110px] shrink-0 cursor-pointer overflow-hidden rounded-xl"
              onClick={() => moveToActivity(item.activity.id)}
            >
              <Image
                src={item.activity.bannerImageUrl}
                alt={item.activity.title}
                fill
                className="object-cover"
              />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};
