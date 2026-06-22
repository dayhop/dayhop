'use client';

import { useRouter } from 'next/navigation';

import { BannerCarousel } from '@/components/blocks/BannerCarousel';
import { BestActivities } from '@/components/blocks/BestActivities';
import { LatestActivities } from '@/components/blocks/LatestActivities';
import { MainpageReview } from '@/components/blocks/MainpageReview';
import { SearchInput } from '@/components/blocks/SearchInput';
import { Userfit } from '@/components/blocks/Main/Userfit';
import { FloatingRecentViews } from '@/components/blocks/Main/FloatingView';

export default function Home() {
  const router = useRouter();

  const handleSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) return;

    router.push(`/activities?keyword=${encodeURIComponent(trimmedKeyword)}`);
  };

  return (
    <main className="flex w-full flex-col items-center pb-20">
      <FloatingRecentViews />
      <section className="w-full px-4 pt-4 md:px-6 xl:px-0">
        <BannerCarousel />
      </section>

      <section className="mt-12 w-full px-4 md:px-6">
        <SearchInput onSearch={handleSearch} />
      </section>

      <section className="mt-16 w-full px-4 md:px-6 xl:flex xl:justify-center xl:px-0">
        <Userfit />
      </section>

      <section className="mt-16 w-full px-4 md:px-6 xl:flex xl:justify-center xl:px-0">
        <BestActivities />
      </section>

      <section className="mt-16 w-full px-4 md:px-6 xl:flex xl:justify-center xl:px-0">
        <LatestActivities />
      </section>

      <section className="mt-16 w-full px-4 md:px-6 xl:flex xl:justify-center xl:px-0">
        <MainpageReview />
      </section>
    </main>
  );
}
