import Image from 'next/image';
import emptyImage from '@/assets/images/empty.png';

export interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mx-auto h-[240px] w-[240px] md:h-[280px] md:w-[280px]">
        <Image
          src={emptyImage}
          alt=""
          fill
          sizes="280px"
          className="object-contain"
          aria-hidden="true"
        />
      </div>
      <p className="text-text-secondary text-lg font-medium">{message}</p>
    </div>
  );
};
