import { Avatar } from '@/components/ui/Avatar';
import { MenuArea } from '../MenuArea';

export const ProfileCard = () => {
  return (
    <div className="border-border-default flex flex-col items-center gap-6 rounded-xl border bg-white px-3.5 py-6 shadow-[0_4px_24px_0_rgba(156,180,202,0.2)] md:gap-3 lg:gap-6">
      <Avatar size="lg" />
      <MenuArea />
    </div>
  );
};
