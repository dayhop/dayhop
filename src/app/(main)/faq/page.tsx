'use client';

import { useState, useMemo } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';

interface FAQItem {
  id: number;
  category: 'payment' | 'experience' | 'account';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    category: 'payment',
    question: '예약을 취소하고 싶은데 환불 기준이 어떻게 되나요?',
    answer:
      '예약 취소 및 환불은 각 체험 호스트의 규정에 따라 달라집니다. 일반적으로 체험 시작 3일 전까지 취소 시 100% 환불이 가능하며, 그 이후에는 기간에 따라 부분 환불 또는 환불 불가가 적용될 수 있습니다. 자세한 내용은 체험 상세 페이지의 환불 정책을 참고해 주시기 바랍니다.',
  },
  {
    id: 2,
    category: 'payment',
    question: '예약 완료 후 결제 수단을 변경할 수 있나요?',
    answer:
      '이미 완료된 예약의 결제 수단 변경은 불가능합니다. 결제 수단을 변경하시려면 기존 예약을 취소한 후 새로운 결제 수단으로 다시 예약을 진행하셔야 합니다.',
  },
  {
    id: 3,
    category: 'experience',
    question: '체험 당일 준비물이 있나요?',
    answer:
      "각 체험별로 필요한 준비물은 예약 완료 시 발송되는 안내 메시지 또는 체험 상세 페이지의 '준비물' 영역에서 확인하실 수 있습니다. 별도의 준비물 안내가 없는 체험은 편안한 복장으로 참여하시면 됩니다.",
  },
  {
    id: 4,
    category: 'experience',
    question: '비가 오거나 날씨가 안 좋으면 체험은 어떻게 되나요?',
    answer:
      '야외 체험의 경우 기상 악화 시 호스트의 판단 또는 안전상의 이유로 일정이 변경되거나 취소될 수 있습니다. 기상 악화로 인한 취소 시에는 100% 환불해 드리며, 변경 사항은 호스트가 개별적으로 사전 연락을 드립니다.',
  },
  {
    id: 5,
    category: 'account',
    question: '비밀번호를 잊어버렸는데 어떻게 재설정하나요?',
    answer:
      "로그인 화면에서 '비밀번호 재설정' 링크를 클릭한 후, 가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크가 발송됩니다. 메일의 안내에 따라 새로운 비밀번호를 설정하실 수 있습니다.",
  },
  {
    id: 6,
    category: 'account',
    question: '회원 탈퇴는 어떻게 하나요?',
    answer:
      "마이 페이지의 회원 정보 관리 탭에서 하단에 있는 '회원 탈퇴' 버튼을 통해 탈퇴를 진행하실 수 있습니다. 탈퇴 시 기존의 예약 내역 및 이용 기록 등은 모두 삭제되며 복구할 수 없으니 신중히 결정해 주시기 바랍니다.",
  },
];

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'payment', label: '예약/결제' },
  { key: 'experience', label: '체험/호스트' },
  { key: 'account', label: '계정/기타' },
] as const;

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFAQ = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-white py-16 md:py-24">
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
            className="text-text-primary placeholder-text-placeholder h-11 w-full rounded-full border border-transparent bg-gray-50 pr-4 pl-11 text-sm transition-all focus:border-gray-200 focus:bg-white focus:ring-0 focus:outline-none"
          />
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
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
                    : 'text-text-secondary hover:text-text-primary bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Q&A Accordion List (Borderless Style) */}
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
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
                      className={`text-gray-400 transition-transform duration-300 ${
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
    </main>
  );
}
