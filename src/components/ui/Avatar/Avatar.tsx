import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
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
  lg: 'h-[70px] w-[70px] md:h-[120px] md:w-[120px]',
};

export const Avatar = ({ src, alt = '프로필 이미지', size = 'md', className }: AvatarProps) => {
  return (
    <div
      className={twMerge(
        'relative overflow-hidden rounded-full',
        avatarSizeClassName[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <DefaultAvatar className="h-full w-full" role="img" aria-label={alt} />
      )}
    </div>
  );
};
