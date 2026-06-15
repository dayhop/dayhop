import { Avatar } from '@/components/ui/Avatar';
import EditIcon2 from '@/assets/icon/EditIcon2.svg';

export const ProfileImage = () => {
  return (
    <div>
      <button type="button">
        <Avatar />
        <EditIcon2 />
      </button>
    </div>
  );
};
