'use client';

import { useState, useMemo } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';

export interface FAQItem {
  id: number;
  category: 'payment' | 'experience' | 'account';
  question: string;
  answer: string;
}

interface FAQContentProps {
  faqData: FAQItem[];
}

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'payment', label: '예약/결제' },
  { key: 'experience', label: '체험/호스트' },
  { key: 'account', label: '계정/기타' },
] as const;

export const FAQContent = ({ faqData }: FAQContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFAQ = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqData, activeCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-[640px] px-6">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-text-primary mb-3 text-3xl font-semibold tracking-tight">
          자주 묻는 질문
        </h1>
        <p className="text-text-tertiary text-sm">
          DayHOP 서비스 이용에 관해 궁금한 점들을 모아보았습니다.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <input
          type="text"
          placeholder="궁금한 질문을 입력해주세요."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpenId(null);
          }}
          className="text-text-primary placeholder-text-placeholder bg-bg-surface focus:bg-bg h-11 w-full rounded-full border border-transparent pr-4 pl-11 text-sm transition-all focus:border-gray-200 focus:ring-0 focus:outline-none"
        />
        <div className="text-text-placeholder absolute top-1/2 left-4 -translate-y-1/2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories (Pill Style) */}
      <div className="mb-10 flex scrollbar-none gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                setActiveCategory(cat.key);
                setOpenId(null);
              }}
              className={`flex-shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-text-primary text-white'
                  : 'text-text-secondary hover:text-text-primary bg-bg-surface hover:bg-border-default'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Q&A Accordion List (Borderless Style) */}
      <div className="divide-border-default border-border-default divide-y border-t border-b">
        {filteredFAQ.length > 0 ? (
          filteredFAQ.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="py-2">
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className="group flex w-full cursor-pointer items-center justify-between py-4 text-left font-medium transition-all"
                >
                  <span className="text-text-primary group-hover:text-primary pr-4 text-sm leading-snug transition-colors md:text-[15px]">
                    {item.question}
                  </span>
                  <span
                    className={`text-text-placeholder transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'max-h-[300px] pb-4 opacity-100'
                      : 'pointer-events-none max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-text-secondary pr-6 text-[14px] leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="border-none py-10">
            <EmptyState message="검색 결과가 없습니다." />
          </div>
        )}
      </div>
    </div>
  );
};
