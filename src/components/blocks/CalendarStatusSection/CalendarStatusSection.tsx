'use client';

import { SelectField } from '@/components/ui/SelectField';
import { CalendarBoard } from '../CalendarBoard';

export const CalendarStatusSection = () => {
  return (
    <>
      <SelectField
        list={['체험1', '체험2']}
        onSelectOption={() => {}}
        selectedOption="체험1"
        defaultMessage="체험을 선택해 주세요"
      />
      <div className="mt-7.5 md:mt-6 lg:mt-7.5">
        <CalendarBoard wrapperClassName="md:rounded-3xl md:bg-white md:pt-5 md:pb-2.5 md:shadow-[0_4px_24px_0_rgba(156,180,202,0.2)]" />
      </div>
    </>
  );
};
