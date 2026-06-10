'use client';

import { useState } from 'react';

import { Pagination } from '@/components/ui/pagination';

import MainpageLatestCard from './MainpageLatestCard';

export interface MainpageLatestItem {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

interface MainpageLatestProps {
  items: MainpageLatestItem[];
}

const CATEGORIES = ['전체', '문화 · 예술', '식음료', '스포츠', '투어', '관광'];

const ITEMS_PER_PAGE = 8;

export default function MainpageLatest({ items }: MainpageLatestProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems =
    selectedCategory === '전체'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const paginationCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const pagedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="mx-auto w-full max-w-[347px] px-4 min-[744px]:w-[696px] min-[744px]:max-w-none min-[744px]:px-0 min-[1200px]:w-[848px]">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold min-[744px]:text-2xl">🔥 최신 게시물</h2>

        <button className="text-text-tertiary hover:text-text-primary cursor-pointer text-sm">
          전체보기 &gt;
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors ${
                isSelected ? 'bg-black text-white' : 'text-text-secondary bg-gray-100'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 min-[1200px]:grid-cols-4">
        {pagedItems.map((item) => (
          <MainpageLatestCard
            key={item.id}
            title={item.title}
            category={item.category}
            price={item.price}
            rating={item.rating}
            reviewCount={item.reviewCount}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>

      {paginationCount > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            paginationCount={paginationCount}
            currentPage={currentPage}
            clickPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            clickNext={() => setCurrentPage((prev) => Math.min(prev + 1, paginationCount))}
            clickPage={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </section>
  );
}
