import Image from 'next/image';

import left from '@/assets/pagination/left_arrow.svg';
import right from '@/assets/pagination/right_arrow.svg';

interface PaginationProps {
  paginationCount: number;
  currentPage: number;
  clickPrev: () => void;
  clickNext: () => void;
  clickPage: (page: number) => void;
}
export function Pagination({
  paginationCount,
  currentPage,
  clickPrev,
  clickNext,
  clickPage,
}: PaginationProps) {
  return (
    <div className="flex h-10 w-76 items-center justify-center gap-1">
      <button
        onClick={clickPrev}
        className="flex h-6 w-6 cursor-pointer items-center justify-center pt-1 disabled:opacity-30"
        disabled={currentPage === 1}
      >
        <Image src={left} width={7} height={11} alt="왼쪽 이동 버튼" />
      </button>
      {Array.from({ length: paginationCount }).map((_, index) => {
        const isActive = currentPage === index + 1;
        return (
          <button
            key={index}
            onClick={() => clickPage(index + 1)}
            className={`flex h-6 w-6 items-center justify-center p-2 text-sm ${isActive ? 'font-bold text-black' : 'text-gray-400'}`}
          >
            {index + 1}
          </button>
        );
      })}
      <button
        className="flex h-6 w-6 cursor-pointer items-center justify-center pt-1 disabled:opacity-30"
        onClick={clickNext}
        disabled={currentPage === paginationCount}
      >
        <Image src={right} width={7} height={11} alt="오른쪽 이동 버튼" />
      </button>
    </div>
  );
}
