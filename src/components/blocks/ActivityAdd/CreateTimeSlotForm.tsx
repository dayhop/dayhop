'use client';

import { SelectField } from '@/components/ui/SelectField';

import MinusIcon from '@/assets/icon/MinusIcon.svg';
import { useState } from 'react';
import { ActivityScheduleInput } from '@/types/api';
import { DateField } from '@/components/ui/AvailableSchedule/DateField';
import { PlusButton } from '@/components/ui/AvailableSchedule/PlusButton';
import { showToast } from '@/utils/toast';
import { TIME_LIST } from '@/constants/ReservationTimes';

interface CreateTimeSlotFormProps {
  onAddSchedule: (newDate: ActivityScheduleInput) => void;
}

export function CreateTimeSlotForm({ onAddSchedule }: CreateTimeSlotFormProps) {
  const [scheduleFormData, setScheduleFormData] = useState<ActivityScheduleInput>({
    date: '',
    startTime: '',
    endTime: '',
  });

  const handleSelectTime = (field: 'startTime' | 'endTime', option: string) => {
    if (field === 'startTime') {
      setScheduleFormData((prev) => ({ ...prev, startTime: option, endTime: '' }));
    } else {
      setScheduleFormData((prev) => ({ ...prev, [field]: option }));
    }
  };

  const handleClickAdd = () => {
    if (!scheduleFormData.date || !scheduleFormData.startTime || !scheduleFormData.endTime) {
      showToast.error('등록할 날짜와 시간을 모두 선택해주세요');
      return;
    }
    onAddSchedule(scheduleFormData);
    setScheduleFormData({ date: '', startTime: '', endTime: '' });
  };

  const endTimeList = scheduleFormData.startTime
    ? TIME_LIST.slice(TIME_LIST.indexOf(scheduleFormData.startTime) + 1)
    : TIME_LIST;

  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <DateField setFormData={setScheduleFormData} data={scheduleFormData.date} />
      <div className="flex w-full items-center gap-4">
        <div className="flex flex-1 items-center justify-center gap-2 md:flex-none">
          <div className="flex-1 md:flex-none">
            <SelectField
              list={TIME_LIST}
              defaultMessage="0:00"
              isLabelReaction={true}
              label="시작 시간"
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
              label="종료 시간"
              onSelectOption={(option) => handleSelectTime('endTime', option)}
              selectedOption={scheduleFormData.endTime}
            />
          </div>
        </div>
        <div className="flex items-center justify-center md:mt-7">
          <PlusButton onClick={handleClickAdd} />
        </div>
      </div>
    </div>
  );
}
