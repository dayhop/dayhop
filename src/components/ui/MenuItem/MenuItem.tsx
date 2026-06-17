import Link from 'next/link';
import { cn } from '@/utils/cn';

interface MenuItemProps {
  children: React.ReactNode;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  selected?: boolean;
}

export const MenuItem = ({ children, Icon, href, selected = false }: MenuItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'hover:bg-primary-100 inline-flex h-13.5 w-full items-center gap-2 rounded-2xl bg-white px-5 font-medium text-gray-600 md:h-12 lg:h-13.5',
        selected && 'bg-primary-100 text-black'
      )}
    >
      {Icon && (
        <span className="inline-flex h-5 w-5 items-center justify-center">
          <Icon className={selected ? 'text-primary' : 'text-gray-600'} />
        </span>
      )}
      <span>{children}</span>
    </Link>
  );
};
