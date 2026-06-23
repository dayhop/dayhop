'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import defaultAvatar from '@/assets/images/avatar-default.png';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const avatarSizeClassName = {
  sm: 'h-5 w-5 md:h-6 md:w-6',
  md: 'h-[30px] w-[30px]',
  lg: 'h-[120px] w-[120px] md:h-[100px] md:w-[100px] lg:h-[120px] lg:w-[120px]',
};

const avatarSizes = {
  sm: '(min-width: 768px) 48px, 40px',
  md: '60px',
  lg: '(min-width: 1024px) 240px, (min-width: 768px) 200px, 240px',
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
      <Image
        src={showDefault ? defaultAvatar : src}
        alt={alt}
        fill
        sizes={avatarSizes[size]}
        quality={80}
        className="object-cover"
        onError={handleImageError}
      />
    </div>
  );
};
