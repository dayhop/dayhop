'use client';

import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/SelectField/DateField';
import { PlusButton } from '@/components/ui/SelectField/PlusButton';

import MinusIcon from '@/assets/icon/MinusIcon.svg';
import { Dispatch, SetStateAction, useState } from 'react';
import { ActivityScheduleInput } from '@/types/api';

//타임 형식... TODO 종료 시간은 시작 시간에 앞서지 않도록 설정
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

interface DateForm {
  formdata?: ActivityScheduleInput[];
  setFormdata: Dispatch<SetStateAction<ActivityScheduleInput[]>>;
}
//prop으로 넘겨줄때는 schedules만 넘겨주면 안에 데이터만
export function DateForm({ formdata, setFormdata }: DateForm) {
  const [scheduleFormData, setScheduleFormData] = useState<ActivityScheduleInput>({
    date: '',
    startTime: '',
    endTime: '',
  });

  const [currentStartOption, setCurrentStartOption] = useState('');
  const [currentEndOption, setCurrentEndOption] = useState('');

  const handleSelectStartOption = (option: string) => {
    setCurrentStartOption(option);
  };

  const handleSelectEndOption = (option: string) => {
    setCurrentEndOption(option);
  };

  const handleClickAdd = () => {
    //state를 가지고 밑에  ui를 만들어줌 그리고 클린업

    if (!scheduleFormData.date || !currentStartOption || !currentEndOption) {
      //TODO 토스트메세지
      alert('등록할 날짜를 선택해주세요');
      return;
    } else {
      const newSchedule: ActivityScheduleInput = {
        date: scheduleFormData.date,
        startTime: currentStartOption,
        endTime: currentEndOption,
      };
      setFormdata((prev) => [...prev, newSchedule]);
      setScheduleFormData({ date: '', startTime: '', endTime: '' });
      setCurrentStartOption('');
      setCurrentEndOption('');
      console.log(newSchedule);
    }
  };
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <DateField setFormData={setScheduleFormData} data={scheduleFormData.date} />
      <div className="flex w-full items-center gap-4">
        <div className="flex flex-1 items-center justify-center gap-2 md:flex-0">
          <div className="flex-1 md:flex-0">
            <SelectField
              list={TIME_LIST}
              defaultMessage="0:00"
              isLabelReaction={true}
              label="시작 시간"
              onSelectOption={handleSelectStartOption}
              selectedOption={currentStartOption}
            />
          </div>
          <div className="md:mt-7">
            {' '}
            <MinusIcon />{' '}
          </div>
          <div className="flex-1 md:flex-0">
            <SelectField
              list={TIME_LIST}
              defaultMessage="0:00"
              isLabelReaction={true}
              label="종료 시간"
              onSelectOption={handleSelectEndOption}
              selectedOption={currentEndOption}
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
