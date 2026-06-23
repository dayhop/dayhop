import { Button } from '@/components/ui/Button';
import ResetIcon from '@/assets/icon/rollback_icon.svg';

interface ResetButtonProp {
  resetButtonBottom: number;
  onReset: () => void;
}
export function ResetButton({ resetButtonBottom, onReset }: ResetButtonProp) {
  return (
    <div
      className="fixed right-10 z-50 transition-all duration-300 ease-in-out"
      style={{ bottom: `${resetButtonBottom}px` }}
    >
      <Button
        className="bg-primary flex h-15 w-15 items-center justify-center rounded-full p-0 text-white shadow-lg"
        onClick={onReset}
      >
        <ResetIcon className="text-bg h-10 w-10" />
      </Button>
    </div>
  );
}
