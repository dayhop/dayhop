import { Avatar } from '@/components/ui/Avatar';
import EditIcon2 from '@/assets/icon/EditIcon2.svg';

export const ProfileImage = () => {
  return (
    <div>
      <button type="button" className="relative cursor-pointer">
        <Avatar size="lg" />
        <EditIcon2 className="absolute right-0 bottom-0 md:h-6 md:w-6 lg:h-7.5 lg:w-7.5" />
      </button>
    </div>
  );
};
