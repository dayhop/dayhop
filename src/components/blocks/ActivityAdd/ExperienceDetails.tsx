'use client';

import AddressForm from '@/components/ui/ActivityAdd/AddressForm';
import Input from '@/components/ui/Input';
import { SelectField } from '@/components/ui/SelectField';
import { Textarea } from '@/components/ui/Textarea';
import { CATEGORY_LIST } from '@/constants/categoty-list';
import { useState } from 'react';

export function ExperienceDetail({ data }) {
  const [categotySelected, setCategotySelected] = useState<string>('');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <label htmlFor="name" className="font-bold">
          제목
        </label>
        <Input name="title" placeholder="제목을 입력해주세요" />
      </div>
      <SelectField
        label="카테고리"
        defaultMessage="카테고리를 선택해주세요"
        list={CATEGORY_LIST}
        onSelectOption={setCategotySelected}
        selectedOption={categotySelected}
      />
      <input type="hidden" name="category" value={categotySelected} />
      <Textarea label="설명" name="description" />
      <div className="flex flex-col gap-2.5">
        <label htmlFor="price" className="font-bold">
          가격
        </label>
        <Input name="price" type="number" min="0" placeholder="체험 금액을 입력해주세요" />
      </div>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="address" className="font-bold">
          주소
        </label>
        <AddressForm />
      </div>
    </div>
  );
}
