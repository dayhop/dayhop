'use client';

import { Suspense, useEffect, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils/cn';

import CategoryCulture from '@/assets/icon/category-culture.svg';
import CategoryFood from '@/assets/icon/category-food.svg';
import CategorySightseeing from '@/assets/icon/category-sightseeing.svg';
import CategorySports from '@/assets/icon/category-sports.svg';
import CategoryTour from '@/assets/icon/category-tour.svg';
import { SearchInput } from '@/components/blocks/SearchInput';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { ActivityCardSkeleton } from '@/components/ui/ActivityCard/ActivityCardSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/pagination';
import { useClickLogger } from '@/hooks/useClickLogger';
import { getActivities, getActivityReviews } from '@/lib/api/activities';

import type { ActivityCategory, ActivityItem } from '@/lib/api/activities/type';

type CategoryItem = {
  label: ActivityCategory | '전체';
  value: ActivityCategory | '전체';
  Icon: ComponentType<SVGProps<SVGSVGElement>> | null;
};

type HoverReview = {
  nickname: string;
  rating: number;
  content: string;
};

const CATEGORIES: CategoryItem[] = [
  { label: '전체', value: '전체', Icon: null },
  { label: '문화 · 예술', value: '문화 · 예술', Icon: CategoryCulture },
  { label: '식음료', value: '식음료', Icon: CategoryFood },
  { label: '스포츠', value: '스포츠', Icon: CategorySports },
  { label: '투어', value: '투어', Icon: CategoryTour },
  { label: '관광', value: '관광', Icon: CategorySightseeing },
];

const PAGE_SIZE = 8;

const getSearchResultText = (keyword: string) => {
  const lastChar = keyword.charCodeAt(keyword.length - 1);
  const isKorean = lastChar >= 0xac00 && lastChar <= 0xd7a3;

  if (!isKorean) return `${keyword}로 검색한 결과입니다.`;

  const finalConsonantIndex = (lastChar - 0xac00) % 28;
  const hasFinalConsonant = finalConsonantIndex !== 0;
  const isRieulFinalConsonant = finalConsonantIndex === 8;

  return `${keyword}${hasFinalConsonant && !isRieulFinalConsonant ? '으로' : '로'} 검색한 결과입니다.`;
};

function ActivitiesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleUpdateLog } = useClickLogger();

  const initialKeyword = searchParams.get('keyword') ?? '';

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activityReviews, setActivityReviews] = useState<Record<number, HoverReview>>({});
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | '전체'>('전체');
  const [keyword, setKeyword] = useState(initialKeyword);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const paginationCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);

      try {
        const res = await getActivities({
          method: 'offset',
          sort: 'latest',
          page: currentPage,
          size: PAGE_SIZE,
          keyword: keyword || undefined,
          category: selectedCategory === '전체' ? undefined : selectedCategory,
        });

        if (!res.success) {
          setActivities([]);
          setActivityReviews({});
          setTotalCount(0);
          return;
        }

        const nextActivities = res.data.activities;

        setActivities(nextActivities);
        setTotalCount(res.data.totalCount);

        const reviewEntries = await Promise.all(
          nextActivities.map(async (activity) => {
            try {
              const reviewRes = await getActivityReviews(activity.id, {
                page: 1,
                size: 1,
              });

              if (!reviewRes.success || reviewRes.data.reviews.length === 0) {
                return [activity.id, undefined] as const;
              }

              const latestReview = reviewRes.data.reviews[0];

              return [
                activity.id,
                {
                  nickname: latestReview.user.nickname,
                  rating: latestReview.rating,
                  content: latestReview.content,
                },
              ] as const;
            } catch {
              return [activity.id, undefined] as const;
            }
          })
        );

        setActivityReviews(
          Object.fromEntries(reviewEntries.filter((entry) => entry[1] !== undefined)) as Record<
            number,
            HoverReview
          >
        );
      } catch {
        setActivities([]);
        setActivityReviews({});
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [currentPage, selectedCategory, keyword]);

  const handleCategoryClick = (category: ActivityCategory | '전체') => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    setKeyword(trimmed);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      params.set('keyword', trimmed);
    } else {
      params.delete('keyword');
    }

    const query = params.toString();
    router.replace(query ? `/activities?${query}` : '/activities');
  };

  const handleReset = () => {
    setKeyword('');
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('keyword');

    const query = params.toString();
    router.replace(query ? `/activities?${query}` : '/activities');
  };

  return (
    <main className="flex w-full flex-col items-center pb-24">
      <section className="mt-16 w-full px-4 md:px-6">
        <SearchInput onSearch={handleSearch} onReset={handleReset} initialValue={keyword} />
      </section>

      <section className="mt-16 w-full max-w-[1200px] px-4 md:px-6 xl:px-0">
        {!keyword && selectedCategory !== '전체' && (
          <h1 className="mb-6 text-[clamp(1.5rem,0.75rem+3.33vw,2rem)] font-bold text-gray-900">
            {selectedCategory}
          </h1>
        )}

        <div className="mb-8 flex [scrollbar-width:none] gap-2 overflow-x-auto [-ms-overflow-style:none] md:gap-4 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((category) => {
            const Icon = category.Icon;
            const isSelected = selectedCategory === category.value;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategoryClick(category.value)}
                className={cn(
                  'flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-bold whitespace-nowrap md:h-12 md:gap-2 md:px-6 md:text-base',
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 transition-colors hover:border-gray-400'
                )}
              >
                {Icon && (
                  <Icon
                    className={
                      isSelected
                        ? 'h-4 w-4 shrink-0 text-white md:h-5 md:w-5 [&_*]:fill-white [&_*]:stroke-white'
                        : 'h-4 w-4 shrink-0 text-gray-900 md:h-5 md:w-5'
                    }
                  />
                )}

                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {keyword && (
          <div className="mb-6">
            <h1 className="text-[clamp(1.5rem,0.75rem+3.33vw,2rem)] leading-normal">
              <span className="font-bold text-gray-900">{keyword}</span>
              <span className="font-semibold text-gray-700">
                {getSearchResultText(keyword).replace(keyword, '')}
              </span>
            </h1>

            <p className="mt-3 text-[clamp(1.125rem,0.9375rem+0.833vw,1.25rem)] font-semibold text-gray-500">
              총 {totalCount}개의 결과
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-6 md:gap-x-5 md:gap-y-8 xl:grid-cols-4 xl:gap-x-6">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <ActivityCardSkeleton key={index} />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <>
            <div className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-6 md:gap-x-5 md:gap-y-8 xl:grid-cols-4 xl:gap-x-6">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  hoverReview={activityReviews[activity.id]}
                  onClick={() => {
                    handleUpdateLog(activity.id, activity.category);
                  }}
                />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Pagination
                paginationCount={paginationCount}
                currentPage={currentPage}
                clickPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                clickNext={() => setCurrentPage((prev) => Math.min(paginationCount, prev + 1))}
                clickPage={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="min-h-[520px]">
            <EmptyState message="등록된 체험이 없습니다." />
          </div>
        )}
      </section>
    </main>
  );
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={null}>
      <ActivitiesPageContent />
    </Suspense>
  );
}
