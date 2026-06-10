import type { ComponentType, SVGProps } from 'react';

export interface ErrorStateProps {
  Illustration: ComponentType<SVGProps<SVGSVGElement>>;
  message: string;
}

export const ErrorState = ({ Illustration, message }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center md:py-16">
      <div className="flex h-[160px] w-[200px] items-center justify-center md:h-[200px] md:w-[240px]">
        <Illustration className="h-full w-full" aria-hidden="true" />
      </div>
      <h1 className="text-text-primary text-lg font-bold whitespace-pre-line md:text-xl">
        {message}
      </h1>
    </div>
  );
};
