'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BannerCarousel } from '@/components/blocks/BannerCarousel';
import { SearchInput } from '@/components/blocks/SearchInput';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { Pagination } from '@/components/ui/pagination';
import { getActivities } from '@/lib/api/activities';

import CategoryCulture from '@/assets/icon/category-culture.svg';
import CategoryFood from '@/assets/icon/category-food.svg';
import CategorySports from '@/assets/icon/category-sports.svg';
import CategoryTour from '@/assets/icon/category-tour.svg';
import CategorySightseeing from '@/assets/icon/category-sightseeing.svg';

import type { ActivityCategory, ActivityItem } from '@/lib/api/activities/type';

type CategoryItem = {
  label: ActivityCategory | '전체';
  value: ActivityCategory | '전체';
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
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
  const initialKeyword = searchParams.get('keyword') ?? '';

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [bannerActivities, setBannerActivities] = useState<ActivityItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | '전체'>('전체');
  const [keyword, setKeyword] = useState(initialKeyword);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const paginationCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  useEffect(() => {
    const fetchBannerActivities = async () => {
      try {
        const data = await getActivities({
          method: 'offset',
          sort: 'latest',
          page: 1,
          size: 4,
        });

        setBannerActivities(data.activities);
      } catch {
        setBannerActivities([]);
      }
    };

    fetchBannerActivities();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);

      try {
        const data = await getActivities({
          method: 'offset',
          sort: 'latest',
          page: currentPage,
          size: PAGE_SIZE,
          keyword: keyword || undefined,
          category: selectedCategory === '전체' ? undefined : selectedCategory,
        });

        setActivities(data.activities);
        setTotalCount(data.totalCount);
      } catch {
        setActivities([]);
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
    setKeyword(value.trim());
    setCurrentPage(1);
  };

  const handleReset = () => {
    setKeyword('');
    setCurrentPage(1);
  };

  return (
    <main className="flex w-full flex-col items-center pb-24">
      <section className="w-full px-4 pt-6 md:px-6 xl:px-0">
        <BannerCarousel activities={bannerActivities} />
      </section>

      <section className="mt-16 w-full px-4 md:px-6">
        <SearchInput onSearch={handleSearch} onReset={handleReset} initialValue={keyword} />
      </section>

      <section className="mt-16 w-full max-w-[1200px] px-4 md:px-6 xl:px-0">
        {!keyword && selectedCategory !== '전체' && (
          <h1 className="mb-6 text-[32px] font-bold text-gray-900">{selectedCategory}</h1>
        )}

        <div className="mb-8 flex flex-wrap gap-4">
          {CATEGORIES.map((category) => {
            const Icon = category.Icon;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategoryClick(category.value)}
                className={
                  selectedCategory === category.value
                    ? 'flex h-12 items-center gap-2 rounded-full bg-gray-900 px-6 text-base font-bold text-white'
                    : 'flex h-12 items-center gap-2 rounded-full border border-gray-300 bg-white px-6 text-base font-bold text-gray-700 transition-colors hover:border-gray-400'
                }
              >
                {Icon && <Icon className="h-5 w-5 shrink-0" />}
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {keyword && (
          <div className="mb-6">
            <h1 className="text-[32px] leading-normal">
              <span className="font-bold text-gray-900">{keyword}</span>
              <span className="font-semibold text-gray-700">
                {getSearchResultText(keyword).replace(keyword, '')}
              </span>
            </h1>

            <p className="mt-3 text-[20px] font-semibold text-gray-500">총 {totalCount}개의 결과</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 justify-items-center gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[340px] w-[262px] animate-pulse rounded-[32px] bg-gray-200"
              />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 justify-items-center gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => router.push(`/activities/${activity.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">등록된 체험이 없습니다.</div>
        )}

        <div className="mt-12 flex justify-center">
          <Pagination
            paginationCount={paginationCount}
            currentPage={currentPage}
            clickPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            clickNext={() => setCurrentPage((prev) => Math.min(paginationCount, prev + 1))}
            clickPage={setCurrentPage}
          />
        </div>
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
