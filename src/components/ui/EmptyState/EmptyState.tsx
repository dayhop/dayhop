import EmptyLogo from '@/assets/icon/empty-logo.svg';

export interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mx-auto flex h-[280px] w-[280px] items-center justify-center">
        <EmptyLogo width={240} height={232} className="opacity-80" />
      </div>
      <p className="text-text-secondary text-lg font-medium">{message}</p>
    </div>
  );
};
