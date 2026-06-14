'use client';

import Input from '@/components/ui/Input';
import { SelectField } from '@/components/ui/SelectField';
import { Textarea } from '@/components/ui/Textarea';
import { CATEGORY_LIST } from '@/constants/categoty-list';
import { useState } from 'react';

export default function ActivityAddPage() {
  const [categotySelected, setCategotySelected] = useState<string>('');

  return (
    <div>
      <div>내 체험 등록</div>
      <label htmlFor="name">제목</label>
      <Input id="name" placeholder="제목을 입력해주세요" />
      <SelectField
        label="카테고리를 선택해주세요"
        list={CATEGORY_LIST}
        onSelectOption={setCategotySelected}
        selectedOption={categotySelected}
      />
      <Textarea label="설명" />
      <label htmlFor="price">가격</label>
      <Input id="price" placeholder="체험 금액을 입력해주세요" />
      <label htmlFor="adress">주소</label>
      <Input id="adress" placeholder="주소를 입력해주세요" />
    </div>
  );
}
