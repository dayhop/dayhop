import Left from '@/assets/icon/left_arrow.svg';
import Right from '@/assets/icon/right_arrow.svg';

interface PaginationProps {
  paginationCount: number;
  currentPage: number;
  clickPrev: () => void;
  clickNext: () => void;
  clickPage: (page: number) => void;
}

const SHOWITEM = 5;

export function Pagination({
  paginationCount,
  currentPage,
  clickPrev,
  clickNext,
  clickPage,
}: PaginationProps) {
  let startPage = currentPage - Math.floor(SHOWITEM / 2);
  startPage = Math.max(1, startPage);
  startPage = Math.min(startPage, Math.max(1, paginationCount - SHOWITEM + 1));

  return (
    <nav aria-label="pagination" className="flex h-10 w-80 items-center justify-center gap-1">
      <button
        onClick={clickPrev}
        className="flex h-6 w-6 cursor-pointer items-center justify-center pt-1 disabled:cursor-default disabled:opacity-30"
        disabled={currentPage <= 1}
      >
        <Left width={8} height={12} />
      </button>
      {paginationCount <= SHOWITEM
        ? Array.from({ length: paginationCount }).map((_, index) => {
            const pageNumber = index + 1;
            const isActive = currentPage === pageNumber;
            return (
              <button
                key={pageNumber}
                onClick={() => clickPage(pageNumber)}
                className={`flex h-6 w-6 cursor-pointer items-center justify-center p-2 text-sm ${isActive ? 'font-bold text-black' : 'text-gray-400'}`}
              >
                {pageNumber}
              </button>
            );
          })
        : Array.from({ length: SHOWITEM }).map((_, index) => {
            const pageNumber = startPage + index;
            const isActive = currentPage === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => clickPage(pageNumber)}
                className={`flex h-6 w-6 cursor-pointer items-center justify-center p-2 text-sm ${isActive ? 'font-bold text-black' : 'text-text-tertiary'}`}
              >
                {pageNumber}
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
    </nav>
  );
}
