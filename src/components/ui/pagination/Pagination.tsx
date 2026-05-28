import Left from '@/assets/pagination/left_arrow.svg';
import Right from '@/assets/pagination/right_arrow.svg';

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
    <div className="flex h-10 w-80 items-center justify-center gap-1">
      <button
        onClick={clickPrev}
        className="flex h-6 w-6 cursor-pointer items-center justify-center pt-1 disabled:cursor-default disabled:opacity-30"
        disabled={currentPage <= 1}
      >
        <Left width={8} height={12} />
      </button>
      {Array.from({ length: paginationCount }).map((_, index) => {
        const isActive = currentPage === index + 1;
        return (
          <button
            key={index}
            onClick={() => clickPage(index + 1)}
            className={`flex h-6 w-6 cursor-pointer items-center justify-center p-2 text-sm ${isActive ? 'font-bold text-black' : 'text-gray-400'}`}
          >
            {index + 1}
          </button>
        );
      })}
      <button
        className="flex h-6 w-6 cursor-pointer items-center justify-center pt-1 disabled:cursor-default disabled:opacity-30"
        onClick={clickNext}
        disabled={currentPage >= paginationCount}
      >
        <Right width={8} height={12} />
      </button>
    </div>
  );
}
