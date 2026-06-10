import type { ComponentType, SVGProps } from 'react';

export interface ErrorStateProps {
  Illustration: ComponentType<SVGProps<SVGSVGElement>>;
  message: string;
}

export const ErrorState = ({ Illustration, message }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex h-[200px] w-[240px] items-center justify-center">
        <Illustration className="h-full w-full" aria-hidden="true" />
      </div>
      <h1 className="text-text-primary text-xl font-bold">{message}</h1>
    </div>
  );
};
