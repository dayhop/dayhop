'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getActivities, getActivityReviews } from '@/lib/api/activities';
import { StarRating } from '@/components/ui/StarRating';

import type { ActivityItem, Reviews } from '@/types/api/activities-types';

interface MainReviewItem {
  activity: ActivityItem;
  review: Reviews;
}

interface MainpageReviewProps {
  items?: MainReviewItem[];
}

const MainpageReview = ({ items }: MainpageReviewProps) => {
  const router = useRouter();

  const [reviews, setReviews] = useState<MainReviewItem[]>(items ?? []);

  const moveToActivity = (activityId: number) => {
    router.push(`/activities/${activityId}`);
  };

  useEffect(() => {
    if (items) return;

    const fetchReviews = async () => {
      try {
        const activityData = await getActivities({
          method: 'offset',
          sort: 'latest',
          page: 1,
          size: 4,
        });

        const reviewResults = await Promise.all(
          activityData.activities.map(async (activity) => {
            const reviewData = await getActivityReviews(activity.id, {
              page: 1,
              size: 1,
            });

            const review = reviewData.reviews[0];

            if (!review) return null;

            return { activity, review };
          })
        );

        setReviews(reviewResults.filter((item): item is MainReviewItem => item !== null));
      } catch {}
    };

    fetchReviews();
  }, [items]);

  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto w-[333px] py-16 min-[744px]:w-[695px] min-[1280px]:w-[1200px]">
      <h2 className="mb-10 text-2xl font-bold">✨ Hopper들의 생생한 후기</h2>

      <div className="grid gap-y-12 min-[1280px]:grid-cols-2 min-[1280px]:gap-x-20">
        {reviews.map((item) => (
          <article key={item.review.id} className="flex justify-between gap-5">
            <div
              className="w-[190px] cursor-pointer min-[744px]:w-[360px] min-[1280px]:w-[330px]"
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
            </div>

            <div
              className="relative h-[160px] w-[110px] shrink-0 cursor-pointer overflow-hidden rounded-xl"
              onClick={() => moveToActivity(item.activity.id)}
            >
              <Image
                src={item.activity.bannerImageUrl}
                alt={item.activity.title}
                fill
                className="object-cover"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MainpageReview;
