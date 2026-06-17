'use client';
import { usePathname } from 'next/navigation';

import UserIcon from '@/assets/icon/UserIcon.svg';
import ListIcon from '@/assets/icon/ListIcon.svg';
import CalendarIcon from '@/assets/icon/CalendarIcon.svg';
import SettingIcon from '@/assets/icon/SettingIcon.svg';
import { MenuItem } from '@/components/ui/MenuItem';

const MENU_ITEMS = [
  //  TODO: 실제 페이지 URL로 교체 필요
  { label: '내 정보', Icon: UserIcon, href: '/mypage/info' },
  { label: '예약내역', Icon: ListIcon, href: '/mypage/reservations' },
  { label: '내 체험 관리', Icon: CalendarIcon, href: '/mypage/activities' },
  { label: '예약현황', Icon: SettingIcon, href: '/mypage/calendar' },
];

export const MenuArea = () => {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col items-center gap-3.5 md:gap-3 lg:gap-3.5">
      {MENU_ITEMS.map(({ label, Icon, href }) => (
        <MenuItem
          key={href}
          Icon={Icon}
          href={href}
          selected={pathname === href || pathname?.startsWith(`${href}/`)}
        >
          {label}
        </MenuItem>
      ))}
    </div>
  );
};
