import Delete from '@/assets/icons/Delete.svg';
import Polygon from '@/assets/icons/Polygon.svg';

interface ToolTipProps {
  message: string;
  children: React.ReactNode;
}

export function ToolTip({ message, children }: ToolTipProps) {
  console.log({ children });
  return (
    <div className="m-0 flex flex-col p-0">
      <Polygon />
      <div className="bg-primary flex w-fit items-center rounded-sm px-2.5 py-2 text-xs text-white">
        <span>{message}</span>
        <Delete width={9} height={9} className="ml-2 cursor-pointer text-2xl" />
      </div>
    </div>
  );
}
