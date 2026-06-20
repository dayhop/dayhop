import { ImgUploadRef } from '@/components/blocks/ActivityAdd/ImgUploader';
import { ActivityResponse } from '@/lib/api/activities/type';
import { ActivityCategory, ActivityScheduleInput } from '@/types/api';
import { showToast } from '@/utils/toast';
import { RefObject } from 'react';

interface DetailForm {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
}

export const validateFormField = (
  detailForm: DetailForm,
  schedules: ActivityScheduleInput[],
  bannerImageCount: number
) => {
  const { title, category, description, address, price } = detailForm;
  if (
    !title ||
    !category ||
    !description ||
    !address ||
    !price ||
    price <= 0 ||
    schedules.length === 0 ||
    bannerImageCount === 0
  ) {
    showToast.error('모든 입력란을 작성해주세요.');
    return false;
  }
  return true;
};

//디테일 폼 세팅 후 리턴하는 함수
export const getDetailFormData = (formData: FormData) => {
  const title = String(formData.get('title') || '').trim();
  const category = String(formData.get('category') || '').trim() as ActivityCategory;
  const description = String(formData.get('description') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const stringPrice = String(formData.get('price') || '0');
  const price = changePriceToNumber(stringPrice);

  return {
    title,
    category,
    description,
    address,
    price,
  };
};

export const getImgCurrnet = (
  bannerRef: RefObject<ImgUploadRef | null>,
  detailRef: RefObject<ImgUploadRef | null>
) => {
  const bannerFile = bannerRef.current?.getValues() || [];
  const detailFiles = detailRef.current?.getValues() || [];
  return {
    bannerFile,
    detailFiles,
  };
};

export const handleIsEdited = (
  detailFormData: ReturnType<typeof getDetailFormData>,
  initData: ActivityResponse,
  subImageIdsToRemove: number[],
  subImageUrlsToAdd: string[],
  scheduleIdsToRemove: number[],
  schedulesToAdd: ActivityScheduleInput[],
  bannerImageUrl: string
) => {
  if (
    detailFormData.title !== initData.title ||
    detailFormData.price !== initData.price ||
    detailFormData.description !== initData.description ||
    detailFormData.address !== initData.address ||
    subImageIdsToRemove.length > 0 ||
    subImageUrlsToAdd.length > 0 ||
    scheduleIdsToRemove.length > 0 ||
    schedulesToAdd.length > 0 ||
    bannerImageUrl !== initData.bannerImageUrl
  ) {
    return true;
  } else {
    return false;
  }
};

//'원'이랑 쉼표 붙은 가격 가져와서 숫자로 변환
export const changePriceToNumber = (formatPrice: string) => {
  const price = Number(formatPrice.replace(/[^0-9]/g, ''));
  return price;
};
