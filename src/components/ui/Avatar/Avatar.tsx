'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import DefaultAvatar from '@/assets/images/avatar-default.svg';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const avatarSizeClassName = {
  sm: 'h-5 w-5 md:h-6 md:w-6',
  md: 'h-[30px] w-[30px]',
  lg: 'h-[120px] w-[120px] md:h-[70px] md:w-[70px] lg:h-[120px] lg:w-[120px]',
};

const avatarSizes = {
  sm: '(min-width: 768px) 24px, 20px',
  md: '30px',
  lg: '(min-width: 1024px) 120px, (min-width: 768px) 70px, 120px',
};

export const Avatar = ({ src, alt = '프로필 이미지', size = 'md', className }: AvatarProps) => {
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const showDefault = !src || errorSrc === src;

  const handleImageError = () => {
    if (src) {
      setErrorSrc(src);
    }
  };

  return (
    <div
      className={cn('relative overflow-hidden rounded-full', avatarSizeClassName[size], className)}
    >
      {showDefault ? (
        <DefaultAvatar className="h-full w-full" role="img" aria-label={alt} />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={avatarSizes[size]}
          className="object-cover"
          onError={handleImageError}
        />
      )}
    </div>
  );
};
