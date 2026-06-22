'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import IconSearch from '@/assets/icon/icon_search.svg';
import IconLocation from '@/assets/icon/icon_location.svg';
import IconPin from '@/assets/icon/icon_pin.svg';
import { Button } from '@/components/ui/Button';
import { ToolTip } from '@/components/ui/ToolTip';
import { showToast } from '@/utils/toast';
import './SearchInput.css';

export interface SearchInputProps {
  onSearch?: (keyword: string) => void;
  onReset?: () => void;
  initialValue?: string;
}

const words = ['취미', '스포츠', '투어', '클래스', '액티비티'];

export function SearchInput({ onSearch, onReset, initialValue = '' }: SearchInputProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(initialValue);
  const [isSearched, setIsSearched] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);

  // prop 변경 시 상태 업데이트
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setInputValue(initialValue);
    setIsSearched(!!initialValue);
  }

  // 3초마다 단어 롤링 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowTooltip(false); // 입력 시작 시 가이드 툴팁 숨김
    if (isSearched) {
      // 입력값이 수정되면 검색하기 버튼으로 복귀
      setIsSearched(false);
    }
  };

  const handleSearchClick = useCallback(() => {
    if (isSearched) {
      // 검색 초기화
      setInputValue('');
      setIsSearched(false);
      onReset?.();
    } else {
      // 검색 실행
      if (!inputValue.trim()) {
        showToast.error('검색어를 입력해주세요');
        return;
      }
      onSearch?.(inputValue);
      setIsSearched(true);
    }
  }, [isSearched, inputValue, onSearch, onReset]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // 위치 아이콘 클릭 시 지도 페이지로 이동
  const handleLocationClick = useCallback(() => {
    router.push('/map');
  }, [router]);

  return (
    <div className="flex w-full flex-col items-center select-none">
      {/* 타이틀 롤링 애니메이션 */}
      <div className="mb-8 flex w-full flex-col items-center text-center">
        <h2 className="flex flex-wrap items-center justify-center gap-y-1 text-[32px] leading-normal font-bold tracking-tight text-gray-900">
          <span>오늘은 새로운</span>
          <div
            className="relative mx-1 inline-block h-[1.3em] overflow-hidden align-bottom transition-all duration-300 ease-in-out md:mx-2"
            style={{ width: `${words[wordIndex].length * 1.1}em` }}
          >
            <span
              key={wordIndex}
              className="text-primary animate-word-slide absolute right-0 left-0 inline-block text-center font-extrabold"
            >
              {words[wordIndex]}
            </span>
          </div>
          <span className="flex items-center">
            로 H
            <IconPin className="text-primary animate-bounce-slow relative bottom-[2px] mx-[1px] inline-block h-[26px] w-[26px] shrink-0 align-middle text-gray-900 md:h-[32px] md:w-[32px]" />
            p 해볼까요?
          </span>
        </h2>
      </div>

      {/* 검색창 입력 영역 */}
      <div className="relative w-full max-w-[960px] px-4 md:px-0">
        <div className="focus-within:ring-primary/20 flex h-[64px] items-center gap-2 rounded-[16px] bg-white py-2 pr-2.5 pl-3 shadow-[0_4px_30px_rgba(0,0,0,0.06)] transition-all duration-300 focus-within:ring-2 hover:shadow-[0_4px_30px_rgba(0,0,0,0.1)] sm:gap-3 sm:pl-5">
          {/* 돋보기 아이콘 */}
          <IconSearch className="h-6 w-6 shrink-0 text-gray-950" />

          {/* 텍스트 입력창 */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="내가 원하는 체험은"
            className="min-w-0 flex-1 bg-transparent pr-2 text-base font-medium text-gray-950 placeholder-gray-400 outline-none sm:text-lg"
          />

          {/* 위치 탐색 버튼 영역 */}
          <div className="relative flex items-center justify-center">
            <button
              id="location-search-btn"
              type="button"
              onClick={handleLocationClick}
              className="group cursor-pointer rounded-full p-1.5 text-gray-900 transition-all hover:bg-gray-50 active:bg-gray-100"
              aria-label="내 주변 체험 조회"
            >
              <IconLocation className="h-7 w-7 text-gray-900 transition-transform duration-300 group-hover:scale-110" />
            </button>

            {/* 위치 버튼 안내 툴팁 */}
            {showTooltip && (
              <ToolTip
                targetId="location-search-btn"
                message="내 주변의 여행 정보를 한눈에 볼 수 있어요"
                align="left"
                placement="bottom"
              />
            )}
          </div>

          {/* 검색 / 초기화 버튼 영역 */}
          <div className="w-[88px] shrink-0 sm:w-[110px]">
            <Button
              type="button"
              size="md"
              onClick={handleSearchClick}
              className={`h-[48px] justify-center rounded-[12px] px-2 text-sm font-semibold transition-all sm:px-4 sm:text-base ${
                isSearched
                  ? 'bg-gray-900 text-white hover:bg-gray-800 active:bg-black'
                  : 'bg-primary shadow-primary/10 text-white shadow-md hover:bg-[#00b0e6] active:bg-[#009dc4]'
              }`}
            >
              {isSearched ? '초기화' : '검색하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
