import Image from 'next/image';

import left from '@/assets/pagination/left_arrow.svg';
import right from '@/assets/pagination/right_arrow.svg';

interface PaginationProps {
  paginationCount: number;
  currentPage: number;
  clickPrev: () => void;
  clickNext: () => void;
}
export function Pagination({
  paginationCount,
  currentPage,
  clickPrev,
  clickNext,
}: PaginationProps) {
  return (
    <div className="flex h-10 w-76 items-center justify-center gap-1">
      <div
        onClick={clickPrev}
        className="flex h-6 w-6 cursor-pointer items-center justify-center pt-1"
      >
        <Image src={left} width={7} height={11} alt="왼쪽 이동 버튼" />
      </div>
      {Array.from({ length: paginationCount }).map((_, index) => {
        const isActive = currentPage === index + 1;
        return (
          <div
            key={index}
            className={`flex h-6 w-6 items-center justify-center p-2 text-sm ${isActive ? 'font-bold text-black' : 'text-gray-400'}`}
          >
            {index + 1}
          </div>
        );
      })}
      <div
        className="flex h-6 w-6 cursor-pointer items-center justify-center pt-1"
        onClick={clickNext}
      >
        <Image src={right} width={7} height={11} alt="오른쪽 이동 버튼" />
      </div>
    </div>
  );
}
