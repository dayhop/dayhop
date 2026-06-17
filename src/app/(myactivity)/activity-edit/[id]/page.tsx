'use client';

import { DateForm, DateFormRef } from '@/components/blocks/ActivityAdd/DateForm';
import { ExperienceDetail } from '@/components/blocks/ActivityAdd/ExperienceDetails';
import { ImgUpload, ImgUploadRef } from '@/components/blocks/ActivityAdd/ImgUploader';
import { Button } from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { getActivity, postActivitiesImage } from '@/lib/api/activities';
import {
  ActivityCategory,
  ActivityResponse,
  ActivityScheduleInput,
} from '@/lib/api/activities/type';
import { patchMyActivity } from '@/lib/api/my-activities';
import { PatchMyActivityRequest } from '@/lib/api/my-activities/type';
import { showToast } from '@/utils/toast';
import { use, useEffect, useRef, useState } from 'react';

interface EditPageProps {
  params: Promise<{ id: number }>;
}
export default function ActivityEditPage({ params }: EditPageProps) {
  const { id } = use(params);

  const dateRef = useRef<DateFormRef>(null);
  const bannerRef = useRef<ImgUploadRef>(null);
  const detailRef = useRef<ImgUploadRef>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initData, setInitData] = useState<ActivityResponse>();

  const validateFormField = (
    title: string,
    category: string,
    description: string,
    address: string,
    price: number,
    schedules: ActivityScheduleInput[],
    bannerImageCount: number
  ) => {
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

  const handleSubmit = async () => {
    if (!initData) return;
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);

    //detail에 있는 거 가져옴
    const title = String(formData.get('title') || '').trim();
    const category = String(formData.get('category') || '').trim() as ActivityCategory;
    const description = String(formData.get('description') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const price = Number(formData.get('price'));

    //유효성 검사를 위한 배너 이미지 갯수체크
    const bannerImageCount = bannerRef.current?.getCurrentUrls?.().length ?? 0;
    const schedules = dateRef.current?.getValues?.() || [];
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
      bannerImageCount
    );

    //유효하지 않는다면 종료
    if (!isValid) return;

    //이미지 등록하기

    const bannerUpload = await postActivitiesImage(bannerFile[0]);
    const detailUploadPromise = detailFiles.map((file) => postActivitiesImage(file));

    const detailUploadResponse = await Promise.all(detailUploadPromise);

    try {
      //초기 데이터랑 비교 후 세팅 : 지워진 건 초기에는 있고, 현재에는 없고
      const currentUrls = detailUploadResponse.map((res) => res.activityImageUrl);

      const subImageIdsToRemove = initData.subImages
        .filter((initdata) => !currentUrls.includes(initdata.imageUrl))
        .map((img) => img.id);

      const subImageUrlsToAdd = currentUrls.filter(
        (url) => !initData.subImages.some((sub) => sub.imageUrl === url)
      );

      const schedulesToAdd = schedules.filter(
        (s) =>
          initData.schedules.findIndex(
            (init) =>
              init.date === s.date && init.startTime === s.startTime && init.endTime === s.endTime
          ) === -1
      );

      const scheduleIdsToRemove = initData.schedules
        .filter(
          (init) =>
            schedules.findIndex(
              (s) =>
                s.date === init.date && s.startTime === init.startTime && s.endTime === init.endTime
            ) === -1
        )
        .map((init) => init.id);

      //데이터 세팅
      const submitData: PatchMyActivityRequest = {
        title,
        category,
        description,
        address,
        price,
        bannerImageUrl: bannerUpload.activityImageUrl,
        subImageIdsToRemove,
        subImageUrlsToAdd,
        scheduleIdsToRemove,
        schedulesToAdd,
      };

      await patchMyActivity(id, submitData);
      setIsOpen(false);
      showToast.success('체험 수정이 완료되었습니다.');
      //TODO: 추가된 체험으로 이동하는 로직 추가
    } catch {
      showToast.error('체험 수정에 실패했습니다.');
    }
  };

  //화면에 마운트 되자마자 초기데이터를 가져옴
  useEffect(() => {
    const getInitData = async () => {
      try {
        const response = await getActivity(id);
        setInitData(response);
      } catch (error) {
        console.error(error);
      }
    };
    getInitData();
  }, []);

  return (
    <div>
      {isOpen && (
        <ConfirmModal
          onConfirm={handleSubmit}
          onClose={() => setIsOpen(false)}
          message="이대로 수정하시겠습니까?"
          isOpen={isOpen}
        />
      )}
      <form ref={formRef} className="flex flex-col justify-center gap-6">
        <div className="py-2.5 text-lg font-bold">내 체험 수정</div>
        <ExperienceDetail data={initData} key={initData?.id || 'loading'} />
        <DateForm ref={dateRef} data={initData} />
        <ImgUpload
          mode="banner"
          ref={bannerRef}
          initialUrls={initData?.bannerImageUrl ? [initData.bannerImageUrl] : undefined}
        />
        <ImgUpload
          mode="detail"
          ref={detailRef}
          initialUrls={
            initData?.subImages ? initData.subImages.map((img) => img.imageUrl) : undefined
          }
        />
        <Button type="button" onClick={() => setIsOpen(true)} size="md" className="mx-auto w-40">
          수정하기
        </Button>
      </form>
    </div>
  );
}
