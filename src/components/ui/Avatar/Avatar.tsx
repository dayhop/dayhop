import Image from 'next/image';
import DefaultAvatar from '@/assets/images/avatar-default.svg';
import { cn } from '@/utils/cn';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const avatarSizeClassName = {
  sm: 'h-5 w-5 md:h-6 md:w-6',
  md: 'h-[30px] w-[30px]',
  lg: 'h-[70px] w-[70px] md:h-[120px] md:w-[120px]',
};

const avatarSizes = {
  sm: '(max-width: 767px) 20px, 24px',
  md: '30px',
  lg: '(max-width: 767px) 70px, 120px',
};

export const Avatar = ({ src, alt = '프로필 이미지', size = 'md', className }: AvatarProps) => {
  return (
    <div
      className={cn('relative overflow-hidden rounded-full', avatarSizeClassName[size], className)}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={avatarSizes[size]} className="object-cover" />
      ) : (
        <DefaultAvatar className="h-full w-full" role="img" aria-label={alt} />
      )}
    </div>
  );
};
