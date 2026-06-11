'use client';

import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/SelectField/DateField';
import { PlusButton } from '@/components/ui/SelectField/PlusButton';

import MinusIcon from '@/assets/icon/MinusIcon.svg';
import { Dispatch, SetStateAction, useState } from 'react';
import { ActivityScheduleInput } from '@/types/api';

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

interface CreateTimeSlotFormProps {
  setDateFormData: Dispatch<SetStateAction<ActivityScheduleInput[]>>;
  setIsData: Dispatch<SetStateAction<boolean>>;
}

//prop으로 넘겨줄때는 schedules만 넘겨주면 안에 데이터만
export function CreateTimeSlotForm({ setDateFormData, setIsData }: CreateTimeSlotFormProps) {
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
      //TODO 토스트메세지
      alert('등록할 날짜와 시간을 모두 선택해주세요');
      return;
    }
    setDateFormData((prev) => [...prev, scheduleFormData]);
    setIsData(true);
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
