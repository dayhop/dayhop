import { Spinner } from '@/components/ui/Spinner';

export function OauthLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl px-10 py-8 shadow-lg">
        <Spinner className="text-text-primary h-10 w-10" />
        <p className="text-text-primary">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
}
