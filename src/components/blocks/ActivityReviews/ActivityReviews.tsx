'use client';

import React, { useEffect, useState } from 'react';
import { getActivityReviews } from '@/lib/api/activities';
import type { Reviews } from '@/lib/api/activities/type';
import { Pagination } from '@/components/ui/pagination';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';

interface ActivityReviewsProps {
  activityId: number;
}

const PAGE_SIZE = 3;

export const ActivityReviews = ({ activityId }: ActivityReviewsProps) => {
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      const res = await getActivityReviews(activityId, {
        page: currentPage,
        size: PAGE_SIZE,
      });
      if (!isMounted) return;
      if (res.success) {
        setReviews(res.data.reviews || []);
        setAverageRating(res.data.averageRating || 0);
        setTotalCount(res.data.totalCount || 0);
      }
      setIsLoading(false);
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [activityId, currentPage]);

  const paginationCount = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    const element = document.getElementById('reviews-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getSatisfactionLabel = (rating: number) => {
    if (rating >= 4.5) return '매우 만족';
    if (rating >= 3.5) return '만족';
    if (rating >= 2.5) return '보통';
    if (rating >= 1.5) return '불만족';
    return '매우 불만족';
  };

  return (
    <div id="reviews-section" className="border-border-default mt-10 border-t pt-10">
      <h2 className="text-text-primary text-xl font-bold">
        체험 후기{' '}
        <span className="text-text-secondary ml-2 text-base font-normal">{totalCount}개</span>
      </h2>

      {isLoading && totalCount === 0 ? (
        <div className="mt-8 flex flex-col gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div key={index} className="border-b border-gray-50 pb-6 last:border-none">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-[14px] w-24" />
                  <Skeleton className="h-[12px] w-16" />
                </div>
              </div>
              <Skeleton className="mt-4 h-[14px] w-full" />
              <Skeleton className="mt-2 h-[14px] w-2/3" />
            </div>
          ))}
        </div>
      ) : totalCount > 0 ? (
        <>
          {/* 평점 요약 영역 */}
          <div className="bg-gray-25 mt-6 flex flex-col items-center gap-6 rounded-2xl p-6 sm:flex-row sm:justify-around md:p-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-text-primary text-5xl font-extrabold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-text-secondary text-sm font-semibold">
                {getSatisfactionLabel(averageRating)}
              </span>
              <div className="text-yellow mt-1 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starVal = i + 1;
                  const isFilled = starVal <= Math.round(averageRating);
                  return (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${isFilled ? 'text-yellow fill-current' : 'fill-current text-gray-200'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  );
                })}
              </div>
              <span className="text-text-tertiary mt-1 text-xs">{totalCount}개 후기</span>
            </div>
          </div>

          {/* 후기 리스트 */}
          <div className="mt-8 flex flex-col gap-6">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <div key={index} className="border-b border-gray-50 pb-6 last:border-none">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-[14px] w-24" />
                        <Skeleton className="h-[12px] w-16" />
                      </div>
                    </div>
                    <Skeleton className="mt-4 h-[14px] w-full" />
                    <Skeleton className="mt-2 h-[14px] w-2/3" />
                  </div>
                ))
              : reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-50 pb-6 last:border-none">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar src={review.user.profileImageUrl || undefined} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-text-primary text-sm font-semibold">
                              {review.user.nickname}
                            </span>
                            <span className="text-text-tertiary text-xs">
                              {review.createdAt.split('T')[0]}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating
                                    ? 'text-yellow fill-current'
                                    : 'fill-current text-gray-200'
                                }`}
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-text-secondary mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {review.content}
                    </p>
                  </div>
                ))}
          </div>

          {/* 페이지네이션 */}
          {paginationCount > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                paginationCount={paginationCount}
                currentPage={currentPage}
                clickPrev={() => handlePageChange(currentPage - 1)}
                clickNext={() => handlePageChange(currentPage + 1)}
                clickPage={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg
            className="text-text-tertiary mb-3 h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-text-secondary text-sm">등록된 체험 후기가 없습니다.</p>
        </div>
      )}
    </div>
  );
};
