import type { ComponentType, SVGProps } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/utils/cn';

export interface ErrorStateProps {
  Illustration?: ComponentType<SVGProps<SVGSVGElement>>;
  image?: StaticImageData;
  message: string;
}

export const ErrorState = ({ Illustration, image, message }: ErrorStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 text-center',
        image ? 'gap-2 py-6 md:py-8' : 'gap-4 py-12 md:py-16'
      )}
    >
      <div
        className={cn(
          'relative flex items-center justify-center',
          image
            ? 'h-[200px] w-[240px] md:h-[320px] md:w-[360px]'
            : 'h-[160px] w-[200px] md:h-[200px] md:w-[240px]'
        )}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="360px"
            className="object-contain"
            aria-hidden="true"
          />
        ) : (
          Illustration && <Illustration className="h-full w-full" aria-hidden="true" />
        )}
      </div>
      <h1 className="text-text-primary text-lg font-bold whitespace-pre-line md:text-xl">
        {message}
      </h1>
    </div>
  );
};
