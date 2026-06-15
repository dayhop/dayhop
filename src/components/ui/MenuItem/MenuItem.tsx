import { Button } from '../Button';

interface MenuItemProps {
  children: React.ReactNode;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const MenuItem = ({ children, Icon }: MenuItemProps) => {
  return (
    <>
      <Button variant="text" Icon={Icon} className="px-5">
        {children}
      </Button>
    </>
  );
};
