'use client';

import type { ActivityCategory } from '@/types/api';
import { CATEGORIES } from './constants';

interface MapCategoryPillsProps {
  selectedCategory: ActivityCategory | '전체';
  onSelectCategory: (category: ActivityCategory | '전체') => void;
}

export function MapCategoryPills({ selectedCategory, onSelectCategory }: MapCategoryPillsProps) {
  return (
    <div className="flex h-[52px] scrollbar-none items-center gap-2 overflow-x-auto bg-white px-4 py-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelectCategory(cat)}
          className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === cat
              ? 'bg-primary border-primary text-white shadow-sm'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
