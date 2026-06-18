import { NotFoundError } from '@/components/blocks/ErrorPage';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <NotFoundError />
    </div>
  );
}
