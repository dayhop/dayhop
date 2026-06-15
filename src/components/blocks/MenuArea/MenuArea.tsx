import UserIcon from '@/assets/icon/UserIcon.svg';
import ListIcon from '@/assets/icon/ListIcon.svg';
import CalendarIcon from '@/assets/icon/CalendarIcon.svg';
import SettingIcon from '@/assets/icon/SettingIcon.svg';
import { MenuItem } from '@/components/ui/MenuItem';

export const MenuArea = () => {
  return (
    <div className="flex flex-col items-center gap-3.5 md:gap-3">
      <MenuItem Icon={UserIcon}>내 정보</MenuItem>
      <MenuItem Icon={ListIcon}>예약내역</MenuItem>
      <MenuItem Icon={CalendarIcon}>내 체험 관리</MenuItem>
      <MenuItem Icon={SettingIcon}>예약현황</MenuItem>
    </div>
  );
};
