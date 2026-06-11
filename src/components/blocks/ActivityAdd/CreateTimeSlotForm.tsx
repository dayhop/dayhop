'use client';

import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/AvailableSchedule/DateField';
import { PlusButton } from '@/components/ui/AvailableSchedule/PlusButton';

import MinusIcon from '@/assets/icon/MinusIcon.svg';
import { Dispatch, SetStateAction, useState } from 'react';
import { ActivityScheduleInput } from '@/types/api';
import { TIME_LIST } from '@/constants/ReservationTimes';
import { showToast } from '@/utils/toast';

interface CreateTimeSlotFormProps {
  setDateFormData: Dispatch<SetStateAction<ActivityScheduleInput[]>>;
}

//prop으로 넘겨줄때는 schedules만 넘겨주면 안에 데이터만
export function CreateTimeSlotForm({ setDateFormData }: CreateTimeSlotFormProps) {
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
      showToast.error('모든 항목을 입력해주세요');
      return;
    }
    setDateFormData((prev) => [...prev, scheduleFormData]);
    setScheduleFormData({ date: '', startTime: '', endTime: '' });
    console.log(scheduleFormData);
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
