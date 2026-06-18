import { BannerCarousel } from '@/components/blocks/BannerCarousel';
import { BestActivities } from '@/components/blocks/BestActivities';
import { LatestActivities } from '@/components/blocks/LatestActivities';
import { MainpageReview } from '@/components/blocks/MainpageReview';
import { SearchInput } from '@/components/blocks/SearchInput';

export default function Home() {
  return (
    <main className="flex w-full flex-col items-center pb-24">
      {/* 추천 컴포넌트 추가 */}

      <section className="w-full px-4 pt-6 md:px-6 xl:px-0">
        <BannerCarousel />
      </section>

      <section className="mt-16 w-full px-4 md:px-6">
        <SearchInput />
      </section>

      <section className="mt-20 w-full px-4 md:px-6 xl:flex xl:justify-center xl:px-0">
        <BestActivities />
      </section>

      <section className="mt-20 w-full px-4 md:px-6 xl:flex xl:justify-center xl:px-0">
        <LatestActivities />
      </section>

      <section className="mt-20 w-full">
        <MainpageReview />
      </section>
    </main>
  );
}
