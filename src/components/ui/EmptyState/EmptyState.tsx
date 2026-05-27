import React from 'react';
import Image from 'next/image';
import emptyImg from '@/assets/icons/img-empty.svg';

export interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mx-auto flex h-[182px] w-[182px] items-center justify-center">
        <Image
          src={emptyImg}
          alt="비어 있음"
          width={122}
          height={122}
          className="object-contain opacity-80"
        />
      </div>
      <h3 className="text-lg font-medium text-gray-600">{message}</h3>
    </div>
  );
};
