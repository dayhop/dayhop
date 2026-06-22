import { Skeleton } from '@/components/ui/Skeleton';

export function ActivityCardSkeleton() {
  return (
    <div className="w-full max-w-[262px] overflow-hidden rounded-[32px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <Skeleton className="aspect-[262/230] w-full rounded-none" />

      <div className="px-[9%] py-[7%]">
        <Skeleton className="mb-3 h-[20px] w-3/4" />
        <Skeleton className="mb-4 h-[16px] w-1/2" />
        <Skeleton className="h-[20px] w-2/5" />
      </div>
    </div>
  );
}
