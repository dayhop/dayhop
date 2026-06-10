import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/SelectField/DateField';
import { PlusButton } from '@/components/ui/SelectField/PlusButton';

import MinusIcon from '@/assets/icon/MinusIcon.svg';

const TIME_LIST = [
  '6:00',
  '7:00',
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
];

export function DateForm() {
  return (
    <div className="flex w-full flex-col">
      <DateField />
      <div className="flex w-full justify-between gap-4">
        <div className="flex flex-1 items-center justify-center gap-2">
          <div className="flex-1">
            <SelectField list={TIME_LIST} defaultMessage="0:00" />
          </div>
          <div>
            {' '}
            <MinusIcon />{' '}
          </div>
          <div className="flex-1">
            <SelectField list={TIME_LIST} defaultMessage="0:00" />
          </div>
        </div>
        <div className="flex items-center justify-center pt-2">
          <PlusButton />
        </div>
      </div>
    </div>
  );
}
