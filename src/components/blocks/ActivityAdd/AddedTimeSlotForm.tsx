'use client';

import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/AvailableSchedule/DateField';

import MinusIcon from '@/assets/icon/MinusIcon.svg';
import { Dispatch, SetStateAction, useState, useImperativeHandle, type Ref } from 'react';
import { ActivityScheduleInput } from '@/types/api';
import { MinusButton } from '@/components/ui/AvailableSchedule/MinusButton';
import { TIME_LIST } from '@/constants/ReservationTimes';

interface AddedTimeSlotFormProp {
  data: ActivityScheduleInput;
  setDateFormData: Dispatch<SetStateAction<ActivityScheduleInput[]>>;
  ref?: Ref<TimeSlotFormRef>;
}

export interface TimeSlotFormRef {
  getValues: () => ActivityScheduleInput;
}

export function AddedTimeSlotForm({ data, setDateFormData, ref }: AddedTimeSlotFormProp) {
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

  useImperativeHandle(ref, () => ({
    getValues: () => scheduleFormData,
  }));

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
