import ImgEmpty from '@/assets/icons/img-empty.svg';

export interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mx-auto flex h-[182px] w-[182px] items-center justify-center">
        <ImgEmpty width={122} height={122} className="opacity-80" />
      </div>
      <p className="text-text-secondary text-lg font-medium">{message}</p>
    </div>
  );
};
