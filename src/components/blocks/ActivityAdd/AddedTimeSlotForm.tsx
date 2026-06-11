'use client';

import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/SelectField/DateField';

import MinusIcon from '@/assets/icon/MinusIcon.svg';
import { Dispatch, SetStateAction, useState } from 'react';
import { ActivityScheduleInput } from '@/types/api';
import { MinusButton } from '@/components/ui/SelectField/MinusButton';

//타임 형식...
const TIME_LIST: string[] = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
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
];
interface AddedTimeSlotFormProp {
  data: ActivityScheduleInput;
  setDateFormData: Dispatch<SetStateAction<ActivityScheduleInput[]>>;
}
export function AddedTimeSlotForm({ data, setDateFormData }: AddedTimeSlotFormProp) {
  const [scheduleFormData, setScheduleFormData] = useState<ActivityScheduleInput>({
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
  });

  const handleSelectTime = (field: 'startTime' | 'endTime', option: string) => {
    if (field === 'startTime') {
      setScheduleFormData((prev) => ({ ...prev, startTime: option, endTime: '' }));
    } else {
      setScheduleFormData((prev) => ({ ...prev, [field]: option }));
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClickRemove = () => {
    setDateFormData((prev) => prev.filter((item) => item !== data));
    setIsOpen(false);
  };

  const endTimeList = scheduleFormData.startTime
    ? TIME_LIST.slice(TIME_LIST.indexOf(scheduleFormData.startTime) + 1)
    : TIME_LIST;

  return (
    isOpen && (
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <DateField setFormData={setScheduleFormData} data={scheduleFormData.date} isLabel={false} />
        <div className="flex w-full items-center gap-4">
          <div className="flex flex-1 items-center justify-center gap-2 md:flex-none">
            <div className="flex-1 md:flex-none">
              <SelectField
                list={TIME_LIST}
                defaultMessage="0:00"
                isLabelReaction={true}
                onSelectOption={(option) => handleSelectTime('startTime', option)}
                selectedOption={scheduleFormData.startTime}
              />
            </div>
            <div className="md:mt-7">
              {' '}
              <MinusIcon />{' '}
            </div>
            <div className="flex-1 md:flex-none">
              <SelectField
                list={endTimeList}
                defaultMessage="0:00"
                isLabelReaction={true}
                onSelectOption={(option) => handleSelectTime('endTime', option)}
                selectedOption={scheduleFormData.endTime}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <MinusButton onClick={handleClickRemove} />
          </div>
        </div>
      </div>
    )
  );
}
