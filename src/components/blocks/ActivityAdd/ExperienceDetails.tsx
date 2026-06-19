'use client';

import AddressForm from '@/components/ui/ActivityAdd/AddressForm';
import Input from '@/components/ui/Input';
import { SelectField } from '@/components/ui/SelectField';
import { Textarea } from '@/components/ui/Textarea';
import { CATEGORY_LIST } from '@/constants/categoty-list';
import { totalPriceToString } from '@/utils/priceFormat';
import { ActivityResponse } from '@/lib/api/activities/type';
import { useEffect, useState } from 'react';

interface ActivityDetailProps {
  data?: ActivityResponse;
}

export function ExperienceDetail({ data }: ActivityDetailProps) {
  const { title, category, description, address, price } = data || {};
  const initdisplay = totalPriceToString(price || 0) + ' 원';
  const [categorySelected, setCategorySelected] = useState<string>(category || '');
  const [displayPrice, setDisplayPrice] = useState<string>(initdisplay);

  // useEffect(() => {
  //   if (price !== undefined) {
  //     setDisplayPrice(totalPriceToString(price) + ' 원');
  //   }
  // }, [price]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <label htmlFor="name" className="font-bold">
          제목
        </label>
        <Input name="title" placeholder="제목을 입력해주세요" defaultValue={title} />
      </div>
      <SelectField
        label="카테고리"
        defaultMessage="카테고리를 선택해주세요"
        list={CATEGORY_LIST}
        onSelectOption={setCategorySelected}
        selectedOption={categorySelected}
      />
      <input type="hidden" name="category" value={categorySelected} />
      <Textarea label="설명" name="description" defaultValue={description} />
      <div className="flex flex-col gap-2.5">
        <label htmlFor="price" className="font-bold">
          가격
        </label>
        <Input
          name="price"
          placeholder="체험 금액을 입력해주세요"
          defaultValue={initdisplay}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, '');
            setDisplayPrice(totalPriceToString(Number(rawValue)));
          }}
          value={displayPrice}
          onBlur={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, '');
            setDisplayPrice(Number(rawValue).toLocaleString() + ' 원');
          }}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="address" className="font-bold">
          주소
        </label>
        <AddressForm defaultValue={address} />
      </div>
    </div>
  );
}
