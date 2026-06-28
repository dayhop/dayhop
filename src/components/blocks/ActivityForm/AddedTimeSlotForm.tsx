'use client';

import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/AvailableSchedule/DateField';

import MinusIcon from '@/assets/icon/MinusIcon.svg';
import { SetStateAction } from 'react';
import { ActivityScheduleInput } from '@/types/api';
import { MinusButton } from '@/components/ui/AvailableSchedule/MinusButton';
import { TIME_LIST } from '@/constants/ReservationTimes';
import { ScheduleItem } from './DateForm';

interface AddedTimeSlotFormProp {
  onUpdateSchedule: (newData: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  data: ScheduleItem;
}

export interface TimeSlotFormRef {
  getValues: () => ActivityScheduleInput;
}

export function AddedTimeSlotForm({
  onUpdateSchedule,
  onDeleteSchedule,
  data,
}: AddedTimeSlotFormProp) {
  //state 함수흉내
  const handleDateChange = (value: SetStateAction<ActivityScheduleInput>) => {
    const updated = typeof value === 'function' ? value(data) : value;
    onUpdateSchedule({ ...updated, id: data.id });
  };

  const handleSelectTime = (field: 'startTime' | 'endTime', option: string) => {
    const updatedData = { ...data };
    if (field === 'startTime') {
      updatedData.startTime = option;
      updatedData.endTime = '';
    } else {
      updatedData[field] = option;
    }

    onUpdateSchedule(updatedData);
  };

  const endTimeList = data.startTime
    ? TIME_LIST.slice(TIME_LIST.indexOf(data.startTime) + 1)
    : TIME_LIST;

  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <DateField setFormData={handleDateChange} data={data.date} isLabel={false} />
      <div className="flex w-full items-center gap-4">
        <div className="flex flex-1 items-center justify-center gap-2 md:flex-none">
          <div className="flex-1 md:flex-none">
            <SelectField
              list={TIME_LIST}
              defaultMessage="0:00"
              isLabelReaction={true}
              onSelectOption={(option) => handleSelectTime('startTime', option)}
              selectedOption={data.startTime}
              buttonClassName="px-3 md:px-5 md:min-w-[120px]"
            />
          </div>
          <div>
            {' '}
            <MinusIcon />{' '}
          </div>
          <div className="flex-1 md:flex-none">
            <SelectField
              list={endTimeList}
              defaultMessage="0:00"
              isLabelReaction={true}
              onSelectOption={(option) => handleSelectTime('endTime', option)}
              selectedOption={data.endTime}
              buttonClassName="px-3 md:px-5 md:min-w-[120px]"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <MinusButton onClick={() => onDeleteSchedule(data.id)} />
        </div>
      </div>
    </div>
  );
}
