import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import WarningIcon from '@/assets/icon/WarningIcon.svg';

export interface ServerErrorProps {
  onRetry: () => void;
}

export function ServerError({ onRetry }: ServerErrorProps) {
  return (
    <div className="flex w-[320px] max-w-[calc(100vw-32px)] flex-col items-center gap-7 md:w-[400px]">
      <ErrorState
        Illustration={WarningIcon}
        message={'문제가 발생했어요.\n잠시 후 다시 시도해주세요.'}
      />
      <div className="grid w-full grid-cols-2 gap-3">
        <Button variant="secondary" size="md" className="min-w-0 px-4 md:px-8" onClick={onRetry}>
          다시 시도
        </Button>
        <Link href="/" className="min-w-0">
          <Button variant="primary" size="md" className="px-4 md:px-8">
            홈으로 가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
