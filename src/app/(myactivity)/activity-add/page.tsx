'use client';

import { DateForm, DateFormRef } from '@/components/blocks/ActivityAdd/DateForm';
import { ExperienceDetail } from '@/components/blocks/ActivityAdd/ExperienceDetails';
import { ImgUpload, ImgUploadRef } from '@/components/blocks/ActivityAdd/ImgUploader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { postActivities, postActivitiesImage } from '@/lib/api/activities';
import {
  ActivityCategory,
  ActivityScheduleInput,
  PostActivitiesData,
} from '@/lib/api/activities/type';
import { showToast } from '@/utils/toast';
import { useRef, useState } from 'react';

export default function ActivityAddPage() {
  const dateRef = useRef<DateFormRef>(null);
  const bannerRef = useRef<ImgUploadRef>(null);
  const detailRef = useRef<ImgUploadRef>(null);

  //모달
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const validateFormField = (
    title: string,
    category: string,
    description: string,
    address: string,
    price: number,
    schedules: ActivityScheduleInput[],
    bannerFile: File[],
    detailFiles: File[]
  ) => {
    if (
      !title ||
      !category ||
      !description ||
      !address ||
      !price ||
      price <= 0 ||
      schedules.length === 0 ||
      bannerFile.length === 0 ||
      detailFiles.length === 0
    ) {
      showToast.error('모든 입력란을 작성해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = String(formData.get('title') || '').trim();
    const category = String(formData.get('category') || '').trim() as ActivityCategory;
    const description = String(formData.get('description') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const price = Number(formData.get('price'));

    const schedules: ActivityScheduleInput[] =
      dateRef.current?.getValues() || ([] as ActivityScheduleInput[]);
    const bannerFile = bannerRef.current?.getValues() || [];
    const detailFiles = detailRef.current?.getValues() || [];

    //유효성 검사
    const isValid = validateFormField(
      title,
      category,
      description,
      address,
      price,
      schedules,
      bannerFile,
      detailFiles
    );

    if (!isValid) return;

    //이미지 업로드
    const bannerUpload = await postActivitiesImage(bannerFile[0]);
    if (!bannerUpload.success) {
      showToast.error(bannerUpload.message);
      return;
    }

    const detailUploadResponse = await Promise.all(
      detailFiles.map((file) => postActivitiesImage(file))
    );
    const failedUpload = detailUploadResponse.find((res) => !res.success);
    if (failedUpload && !failedUpload.success) {
      showToast.error(failedUpload.message);
      return;
    }

    const bannerImageUrl = bannerUpload.data.activityImageUrl;
    const subImageUrls = detailUploadResponse.flatMap((res) =>
      res.success ? [res.data.activityImageUrl] : []
    );

    //데이터 세팅
    const submitData: PostActivitiesData = {
      title,
      category,
      description,
      address,
      price,
      schedules: schedules as ActivityScheduleInput[],
      bannerImageUrl,
      subImageUrls,
    };

    const createRes = await postActivities(submitData);
    if (!createRes.success) {
      showToast.error(createRes.message);
      return;
    }
    setIsOpen(true);
    showToast.success('체험 등록이 완료되었습니다.');
    //TODO: 추가된 체험으로 이동하는 로직 추가
  };
  return (
    <div>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} className="min-w-80">
          <div className="flex flex-col gap-4">
            <p>체험 등록이 완료되었습니다.</p>
            <Button onClick={() => setIsOpen(false)}>확인</Button>
          </div>
        </Modal>
      )}
      <form className="flex flex-col justify-center gap-6" onSubmit={handleSubmit}>
        <div className="py-2.5 text-lg font-bold">내 체험 등록</div>
        <ExperienceDetail />
        <DateForm ref={dateRef} />
        <ImgUpload mode="banner" ref={bannerRef} />
        <ImgUpload mode="detail" ref={detailRef} />
        <Button type="submit" size="md" className="mx-auto w-40">
          등록하기
        </Button>
      </form>
    </div>
  );
}
